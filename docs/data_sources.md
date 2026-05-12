# Data Sources and Modeling Plan

## Official public-health sources

- CDC NNDSS annual summary data: finalized annual counts for nationally notifiable diseases.
- CDC NNDSS weekly data: provisional weekly counts on data.cdc.gov.
- CDC hantavirus overview and reported case summaries: background, surveillance history, and known public data limitations.
- WHO hantavirus fact sheet: disease background, transmission caveats, and global context.

Useful links:

- https://wonder.cdc.gov/nndss.html
- https://data.cdc.gov/NNDSS/NNDSS-Weekly-Data/x9gk-5huc
- https://www.cdc.gov/hantavirus/data-research/cases/index.html
- https://www.who.int/news-room/fact-sheets/detail/hantavirus

## Environmental feature sources

Future production data should join surveillance records with:

- NOAA climate summaries: temperature, precipitation, drought proxies.
- U.S. Census / ACS: population and rurality indicators.
- NLCD or USDA land-cover data: forest cover, grassland, and habitat proxies.
- State or county shapefiles for map visualization.

## MVP data policy

The current `data/demo/hantavirus_risk_demo.csv` file is demo data. It is used only to validate the ML pipeline, API, and dashboard before the official data ingestion step is added.

Do not describe demo metrics as real-world epidemiological performance.

## Recommended production target

Because hantavirus case counts are sparse and county-level data is restricted, model this as a risk-level classification problem:

- `low`: expected background risk
- `medium`: elevated environmental or historical risk
- `high`: high-risk conditions relative to the state-year baseline

This framing is safer and more credible than claiming precise outbreak prediction.

