import sys
import json
import pandas as pd
from yfinance import Ticker
from datetime import datetime


def show(symbol, start_date, end_date, result):
    if result is not None and "data" in result:
        data = pd.DataFrame(result["data"])
        # Print formatted DataFrame
        print("\n" + "=" * 50)
        print(f"{symbol} Stock Prices from {start_date} to {end_date}")
        print("=" * 50)
        print(data)
        print("=" * 50)

    if result is not None and "error" in result:
        print(f"Error: {result['error']}")


def fetch(symbol, start_date, end_date):
    ticker = Ticker(symbol)

    try:
        # Ensure start_date <= end_date
        if start_date > end_date:
            raise ValueError("End date cannot be earlier than start date.")

        # Fetch the data using yfinance
        data = ticker.history(start=start_date, end=end_date)

        if not data.empty:
            data = data.round(decimals=2)
            data = data[["Open", "Close", "Volume"]]
            data.reset_index(inplace=True)
            # Convert the 'Date' column to just date (removing time)
            data["Date"] = data["Date"].dt.date
            return {"data": data.to_dict(orient="records")}
        else:
            raise Exception("No data available for this ticker.")

    except ValueError as ve:
        return {"error": f"Date Error: {ve}"}

    except Exception as e:
        return {"error": e}


if __name__ == "__main__":
    print("\nWelcome to the Stock Price Fetcher!")
    print("=" * 50)

    try:
        while True:
            ticker = input(
                "Please enter a ticker (e.g., AAPL) or type 'exit' to quit: "
            ).upper()
            if ticker == "EXIT":
                print("Exiting the program. Goodbye!")
                break

            start = input("Please enter start date (YYYY-MM-DD): ")
            end = input("Please enter end date (YYYY-MM-DD): ")

            # Validate date format
            try:
                datetime.strptime(start, "%Y-%m-%d")
                datetime.strptime(end, "%Y-%m-%d")
                print("\nFetching >>>")
                result = fetch(ticker, start, end)
                show(ticker, start, end, result)
            except ValueError as ve:
                print(f"Date format error: {ve}")

    except KeyboardInterrupt:
        print("\nExiting the program. Goodbye")
        sys.exit(0)
