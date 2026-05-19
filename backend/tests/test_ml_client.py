from app.clients.ml import MLServiceClient


def test_ml_client_accepts_base_service_url():
    client = MLServiceClient(service_url="http://ml:8001")

    assert client.endpoint_url == "http://ml:8001/api/v1/generate"


def test_ml_client_accepts_generate_endpoint_url():
    client = MLServiceClient(service_url="http://ml:8001/api/v1/generate")

    assert client.endpoint_url == "http://ml:8001/api/v1/generate"
