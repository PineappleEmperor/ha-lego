#!/usr/bin/env bash
# Mechanical conformance check for the ha-integration skill.
# Fails on anything a grep can decide; judgement items live in the skill's Mode 4
# checklist. Keep these rules in lockstep with the skill.
set -uo pipefail

DOMAIN="lego"
PKG="custom_components/${DOMAIN}"
FAILURES=0

fail() {
  echo "FAIL: $1" >&2
  FAILURES=$((FAILURES + 1))
}

pass() {
  echo "ok: $1"
}

# --- canonical workflows -----------------------------------------------------
for wf in \
  create-dev-pr.yml \
  release_drafter.yml \
  pr-labeler.yml \
  lint_pr.yml \
  hacs_validate.yml \
  hassfest_validate.yml \
  python_validate.yml \
  check-manifest-version.yml \
  quality_audit.yml \
  semantic_release.yml \
  release.yml; do
  if [ -f ".github/workflows/${wf}" ]; then
    pass "workflow ${wf}"
  else
    fail "missing workflow .github/workflows/${wf}"
  fi
done

# --- action pins -------------------------------------------------------------
check_pin() {
  local action="$1" min="$2"
  local found
  found=$(grep -rhoE "${action}@v[0-9]+" .github/workflows/ 2>/dev/null | sort -u || true)
  [ -z "$found" ] && return 0
  while read -r ref; do
    local version="${ref##*@v}"
    if [ "$version" -lt "$min" ]; then
      fail "stale action pin ${ref} (expected v${min} or newer)"
    fi
  done <<< "$found"
}

check_pin "actions/checkout" 7
check_pin "actions/setup-python" 6
check_pin "softprops/action-gh-release" 3
check_pin "amannn/action-semantic-pull-request" 6
check_pin "release-drafter/release-drafter" 7
pass "action pins"

# --- antipatterns in the integration package ---------------------------------
antipattern() {
  local pattern="$1" why="$2"
  if grep -rnE "$pattern" "$PKG" --include='*.py' >/dev/null 2>&1; then
    grep -rnE "$pattern" "$PKG" --include='*.py' >&2
    fail "$why"
  fi
}

antipattern 'discovery\.async_load_platform' "legacy discovery.async_load_platform"
antipattern 'BaseNotificationService' "legacy notify BaseNotificationService"
antipattern 'update_before_add=True' "update_before_add=True blocks setup"
antipattern 'class .*OptionsFlowHandler' "legacy OptionsFlowHandler naming"
antipattern 'PlatformNotReady' "PlatformNotReady is for legacy platforms"
antipattern '_LOGGER\.(debug|info|warning|error|exception)\(f"' "f-string logging"
antipattern '# type: ignore$' "bare type: ignore without an error code"
antipattern 'hass\.data\[DOMAIN\]' "hass.data instead of entry.runtime_data"
pass "no antipatterns in ${PKG}"

# --- required metadata -------------------------------------------------------
[ -f "${PKG}/quality_scale.yaml" ] || fail "missing ${PKG}/quality_scale.yaml"
[ -f "${PKG}/diagnostics.py" ] || fail "missing ${PKG}/diagnostics.py"
[ -f "${PKG}/brand/icon.png" ] || fail "missing ${PKG}/brand/icon.png"
[ -f "${PKG}/brand/icon@2x.png" ] || fail "missing ${PKG}/brand/icon@2x.png"
[ -f "${PKG}/brand/logo.png" ] || fail "missing ${PKG}/brand/logo.png"
[ -f "${PKG}/brand/logo@2x.png" ] || fail "missing ${PKG}/brand/logo@2x.png"
grep -q '"integration_type"' "${PKG}/manifest.json" || fail "manifest.json lacks integration_type"
grep -q '"issue_tracker"' "${PKG}/manifest.json" || fail "manifest.json lacks issue_tracker"
pass "required metadata"

# --- required patterns -------------------------------------------------------
grep -q 'runtime_data' "${PKG}/__init__.py" || fail "__init__.py does not use entry.runtime_data"
grep -q 'async_shutdown' "${PKG}/__init__.py" || fail "coordinators are not shut down on unload"
grep -q 'async_step_reauth' "${PKG}/config_flow.py" || fail "config_flow.py lacks a reauth step"
grep -q 'async_step_reconfigure' "${PKG}/config_flow.py" || fail "config_flow.py lacks a reconfigure step"
grep -q '_attr_has_entity_name' "${PKG}/entity.py" || fail "entity.py does not set _attr_has_entity_name"
grep -rq 'PARALLEL_UPDATES' "${PKG}" || fail "no platform declares PARALLEL_UPDATES"
pass "required patterns"

# --- domain-specific: every billed call goes through the quota manager -------
if grep -rnE '"getSets"' "${PKG}" --include='*.py' | grep -v 'api\.py' >/dev/null 2>&1; then
  fail "getSets is called outside api.py, bypassing the quota manager"
fi
pass "quota manager owns every billed call"

if [ "$FAILURES" -gt 0 ]; then
  echo "" >&2
  echo "${FAILURES} audit failure(s)." >&2
  exit 1
fi

echo ""
echo "Skill audit passed."
