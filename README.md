# tidytab

A Google Chrome extension for tidying up tabs on browser.

## Features

- **Sorting**:
  - Sort tabs by URL in desc or asc order.
  - Consider tab groups when sorting.
- **Removing**:
  - Remove tabs with duplicate URLs.
  - Remove initial state tabs.
  - Remove all tabs except the current one.
- **Grouping**:
  - Group tabs by domain of the URL.
  - Ungroup tabs.

## Demo

### Sort tabs by URL in desc or asc order

![demo_sort](https://raw.githubusercontent.com/mogulla3/tidytab/master/demo/tidytab_sort.gif)

### Remove tabs with duplicate URLs

![demo_remove_dup](https://raw.githubusercontent.com/mogulla3/tidytab/master/demo/tidytab_remove_dup.gif)

### Remove initial state tabs.

![demo_remove_new_tab](https://raw.githubusercontent.com/mogulla3/tidytab/master/demo/tidytab_remove_new_tab.gif)

### Remove all tabs except the current one.

TODO

## Specifications

### Tab sorting specification

- Tabs are sorted by URL.
  - Ignore protocol(e.g. http, https) when comparing.
  - Ignore `www` subdomain when comparing.
  - Ignore searchParams when comparing.
- Tabs are placed after TabGroups.

### TabGroup sorting specification

- TabGroups are sorted by `title` of the TabGroup.
- TabGroups are placed before Tabs.

### Tab grouping specification

- Group by tab URL domain.
- Grouping only occurs when there are two or more tabs for the same domain.
- The domain of the URL is used for the title of the TabGroup.
  - `www` subdomain is removed.
