from django.shortcuts import render
from django.http import JsonResponse
from .tracker import fetch


# Create views
def index(request):
    return render(request, "index.html")


def fetch_data(request):
    ticker = request.POST.get("ticker")
    start = request.POST.get("startDate")
    end = request.POST.get("endDate")

    result = fetch(ticker, start, end)

    if "error" in result:
        return JsonResponse(result, status=400)
    else:
        return JsonResponse(result, status=200)
