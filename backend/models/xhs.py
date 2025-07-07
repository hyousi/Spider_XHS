from pydantic import BaseModel
from typing import Optional, List


class UserData(BaseModel):
    gender: int
    images: str
    imageb: str
    guest: bool
    red_id: str
    user_id: str
    nickname: str
    desc: str


class Category(BaseModel):
    id: str
    name: str


class HomefeedCategoryResponse(BaseModel):
    categories: list[Category]


class FeedUser(BaseModel):
    nick_name: str
    avatar: str
    user_id: str
    nickname: str
    xsec_token: str


class ImageInfo(BaseModel):
    image_scene: str
    url: str


class Cover(BaseModel):
    url_default: str
    file_id: str
    height: int
    width: int
    url: str
    info_list: List[ImageInfo]
    url_pre: str


class InteractInfo(BaseModel):
    liked: bool
    liked_count: str


class VideoCapa(BaseModel):
    duration: int


class Video(BaseModel):
    capa: VideoCapa


class NoteCard(BaseModel):
    interact_info: InteractInfo
    cover: Cover
    type: str
    display_title: str
    user: FeedUser
    video: Optional[Video] = None


class FeedItem(BaseModel):
    id: str
    model_type: str
    note_card: NoteCard
    ignore: bool
    xsec_token: str
    track_id: str


class HomefeedResponse(BaseModel):
    items: List[FeedItem]
    cursor_score: str
