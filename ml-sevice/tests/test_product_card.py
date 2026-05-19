from app.services.product_card import ProductCardService


def test_parse_json_llm_response():
    parsed = ProductCardService._parse_llm_response(
        '{"title": "Test title", "description": "Test description"}',
        "fallback",
    )

    assert parsed == {"title": "Test title", "description": "Test description"}


def test_parse_plain_text_llm_response_falls_back_to_object_name():
    parsed = ProductCardService._parse_llm_response("Plain generated text", "bottle")

    assert parsed == {"title": "Bottle", "description": "Plain generated text"}
