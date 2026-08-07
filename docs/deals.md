# Amazon deals feed (proposal)

Brickset runs Bargain Watch and publishes the results as RSS. Matching those
against your wishlist turns "a set you want is 45% off" into a notification.

## Source

| | |
|---|---|
| URL | `https://brickset.com/feed/amazon/{region}` |
| Regions | `uk`, `us`, `de`, `fr`, `es`, `it`, `ca`, `au` |
| Auth | none |
| Brickset API calls | none — the feed is not the API and does not touch the daily budget |

Each item is a "Discounts at Amazon.co.uk" article whose `description` holds an HTML
table of many sets, one row each: set number, name, current price, previous price
and discount percentage.

## Affiliate links

Every Amazon link in the feed carries Brickset's own affiliate tag:

```
https://www.amazon.co.uk/dp/B0CFVY784R/ref=nosim?tag=bargainwatch-21
```

**These are passed through unmodified.** Brickset found the deal and supplies the
data this integration is built on; stripping their tag would take the benefit and
deny them the referral. What stays forbidden is adding *our own* tags to anything,
which no part of this does.

Because it sends users to a monetised link, the feature is **opt-in and off by
default**, and the README states plainly that enabling it means Brickset's affiliate
links.

## Parsing, and how it will break

The prices live in an HTML table inside an RSS description, so this is scraping with
extra steps. If Brickset restyles that table, parsing fails.

It must fail quietly: log once, keep the last good data, leave entities available
with their previous state. A deals feature that turns an entire integration unhealthy
because a table gained a column is worse than no deals feature.

## Surface

- A sensor counting current deals that match your wishlist, with the matches on its
  attributes: set number, name, price, previous price, discount, link.
- An event per newly discounted wanted set, for automations.

Region follows the pricing region already chosen in options, with an override for
anyone who prices in one market and buys in another.

Polling hourly is plenty; the underlying Bargain Watch does not update faster, and
the feed is somebody else's bandwidth.

## Open questions

- Match on wanted sets only, or owned too (a spare at 45% off is still interesting)?
- Is a discount threshold worth exposing, or is the feed already filtered enough?
- Should deals appear on the wishlist surface, wherever that ends up living?
