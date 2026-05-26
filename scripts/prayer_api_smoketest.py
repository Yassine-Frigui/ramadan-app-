import datetime
import sys
import urllib.parse
import urllib.request

TUNIS = {
    "city": "Tunis",
    "country": "Tunisia",
    "latitude": 36.8065,
    "longitude": 10.1815,
}

PRAYER_KEYS = ["Fajr", "Dhuhr", "Asr", "Maghrib", "Isha"]

ALADHAN_BASE_URL = "https://api.aladhan.com/v1"

# Optional query parameters to align with manual testing on the AlAdhan site.
# Set any value to None to omit it from the request.
ALADHAN_QUERY_DEFAULTS = {
    "school": 0,  # 0=Shafi, 1=Hanafi
    "midnightMode": 0,
    "latitudeAdjustmentMethod": None,
    "calendarMethod": "HJCoSA",
    "timezonestring": None,
    "shafaq": None,
    "tune": "0,0,0,7,0,3,3",
    "iso8601": None,
    "adjustment": None,
}

ALADHAN_METHODS = [
    {"id": 4, "name": "Umm Al-Qura (Makkah)"},
    {"id": 3, "name": "Muslim World League"},
    {"id": 2, "name": "ISNA (North America)"},
    {"id": 5, "name": "Egyptian Authority"},
    {"id": 1, "name": "University of Karachi"},
    {"id": 18, "name": "Tunisia"},
]


def _http_get_json(url: str, timeout: int = 10) -> dict:
    request = urllib.request.Request(
        url,
        headers={
            "User-Agent": "ramadan-app-prayer-smoketest/1.0",
            "Accept": "application/json",
        },
    )
    with urllib.request.urlopen(request, timeout=timeout) as response:
        raw = response.read().decode("utf-8")
        import json

        return json.loads(raw)


def _clean_time(value: str) -> str:
    # Strip timezone suffix like "05:10 (CET)".
    return value.split(" ")[0]


def fetch_aladhan_for_method(date_obj: datetime.date, method: dict) -> dict:
    date_str = date_obj.strftime("%d-%m-%Y")
    query_params = {
        "latitude": TUNIS["latitude"],
        "longitude": TUNIS["longitude"],
        "method": method["id"],
    }
    for key, value in ALADHAN_QUERY_DEFAULTS.items():
        if value is not None:
            query_params[key] = value
    query = urllib.parse.urlencode(query_params)
    url = f"{ALADHAN_BASE_URL}/timings/{date_str}?{query}"
    try:
        payload = _http_get_json(url)
        if payload.get("code") != 200:
            raise RuntimeError(payload.get("status", "API error"))
        timings = payload["data"]["timings"]
        return {
            "source": f"aladhan:http:method={method['id']}",
            "label": method["name"],
            "times": {k: _clean_time(timings[k]) for k in PRAYER_KEYS},
        }
    except Exception as exc:
        return {
            "source": f"aladhan:http:method={method['id']}",
            "label": method["name"],
            "error": str(exc),
        }


def format_result(result: dict) -> str:
    if "error" in result:
        return f"- {result['source']} ({result.get('label', '')}): ERROR: {result['error']}"
    times = " ".join(f"{k[:1]}:{result['times'][k]}" for k in PRAYER_KEYS)
    return f"- {result['source']} ({result.get('label', '')}): {times}"


def main() -> int:
    if len(sys.argv) > 1:
        date_obj = datetime.date.fromisoformat(sys.argv[1])
    else:
        date_obj = datetime.date.today()

    results = []
    for method in ALADHAN_METHODS:
        results.append(fetch_aladhan_for_method(date_obj, method))

    print(f"Location: {TUNIS['city']}, {TUNIS['country']} (lat={TUNIS['latitude']}, lon={TUNIS['longitude']})")
    print(f"Date: {date_obj.isoformat()}")
    print("Results:")
    for item in results:
        print(format_result(item))

    return 0


if __name__ == "__main__":
    raise SystemExit(main())
