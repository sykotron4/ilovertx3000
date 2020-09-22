# Contributing

## Additional shop requirements

Adding an entire shop is not possible; for a GPU (or other item) to be tracked the item __needs to be listed on the shop__ and has some
kind of stock status information available. In case of multiple items the best case would be an overview page which shows all items that should
be tracked _and_ stock status.

It is __not__ possible to add the entire Canadian Amazon, but it __is__ possible to add single products / product lists listed on Canadian Amazon.

## Submitting Pull Requests

- Follow https://www.conventionalcommits.org/en/v1.0.0/
- PRs must obey the coding standard (checked via GitHub action)
- Crawling shops should always be optimized as much as possible. If possible try to crawl the overview page once of a product instead of making 
multiple requests.