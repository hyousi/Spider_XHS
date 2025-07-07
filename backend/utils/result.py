from typing import Generic, TypeVar, Literal, Union, Annotated
from pydantic import BaseModel, Field, TypeAdapter
from requests import Response

ModelT = TypeVar("ModelT", bound=BaseModel)


class SuccessResponse(BaseModel, Generic[ModelT]):
    success: Literal[True]
    msg: str | None
    data: ModelT


class ErrorResponse(BaseModel):
    success: Literal[False]
    msg: str
    data: None = None


type DiscriminatedApiResponse[ModelT: BaseModel] = Annotated[
    Union[SuccessResponse[ModelT], ErrorResponse],
    Field(discriminator="success"),
]


def safe_json_response(
    response: Response, data_model: type[ModelT]
) -> SuccessResponse[ModelT] | ErrorResponse:
    api_response_adapter = TypeAdapter(DiscriminatedApiResponse[data_model])
    parsed_response = api_response_adapter.validate_python(response.json())
    return parsed_response
