import re

CATEGORIAS = {
    "mercado": "Comida",
    "supermercado": "Comida",
    "ifood": "Delivery",
    "uber": "Transporte",
    "ônibus": "Transporte"
}

def parse_message(message: str):
    valor_match = re.search(r'(\d+([.,]\d+)?)', message)
    valor = float(valor_match.group(1).replace(',', '.')) if valor_match else None

    categoria = "Outros"
    for palavra, cat in CATEGORIAS.items():
        if palavra in message.lower():
            categoria = cat
            break

    return {
        "valor": valor,
        "categoria": categoria,
        "descricao": message
    }
