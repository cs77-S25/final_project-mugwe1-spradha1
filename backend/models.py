from flask_sqlalchemy import SQLAlchemy
import base64

db = SQLAlchemy()
class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(255), unique=True, nullable=False)
    email = db.Column(db.String(255), unique=True, nullable=False)
    created_at = db.Column(db.DateTime, default=db.func.current_timestamp())
    bio = db.Column(db.Text, nullable=True)
    profile_picture_url = db.Column(db.String(255), nullable=True)

    def __repr__(self) -> str:
        string = f"ID: {self.id}, Name: {self.name}, Email: {self.email}, Created_At: {self.created_at}, Bio: {self.bio}, Profile_Picture_URL: {self.profile_picture_url}"
        return string

    def serialize(self):
        return {
            "id": self.id,
            "name": self.name,
            "email": self.email,
            "created_at": self.created_at,
            "bio": self.bio,
            "profile_picture_url": self.profile_picture_url,
        }

class ItemListing(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(255), nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    description = db.Column(db.Text, nullable=False)
    price = db.Column(db.Float, nullable=False)
    created_at = db.Column(db.DateTime, default=db.func.current_timestamp())
    color = db.Column(db.String(50), nullable=False)
    size = db.Column(db.String(50), nullable=False)
    gender = db.Column(db.String(50), nullable=False)
    condition = db.Column(db.String(50), nullable=False)
    category = db.Column(db.String(50), nullable=False)
    picture_data = db.Column(db.LargeBinary, nullable=False)

    def serialize(self):
        encoded_picture = base64.b64encode(self.picture_data).decode('utf-8')
        return {
            "id": self.id,
            "title": self.title,
            "user_id": self.user_id,
            "description": self.description,
            "price": self.price,
            "created_at": self.created_at,
            "color": self.color,
            "size": self.size,
            "gender": self.gender,
            "condition": self.condition,
            "category": self.category,
            "picture_data": encoded_picture,
        }

class ForumPost(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(255), nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    content = db.Column(db.Text, nullable=False)
    photo_data = db.Column(db.LargeBinary, nullable=True)
    created_at = db.Column(db.DateTime, default=db.func.current_timestamp())

    def __repr__(self) -> str:
        string = f"ID: {self.id}, Title: {self.title}, User_ID: {self.user_id}, Content: {self.content}, Created_At: {self.created_at}"
        return string

    def serialize(self):
        return {
            "id": self.id,
            "title": self.title,
            "user_id": self.user_id,
            "content": self.content,
            "photo_data": self.photo_data.encode('utf-8') if self.photo_data else None,
            "created_at": self.created_at,
        }

class ForumComment(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    forum_post_id = db.Column(db.Integer, db.ForeignKey('forum_post.id'), nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    content = db.Column(db.Text, nullable=False)
    created_at = db.Column(db.DateTime, default=db.func.current_timestamp())

    def __repr__(self) -> str:
        string = f"ID: {self.id}, Forum_Post_ID: {self.forum_post_id}, User_ID: {self.user_id}, Content: {self.content}, Created_At: {self.created_at}"
        return string

    def serialize(self):
        return {
            "id": self.id,
            "forum_post_id": self.forum_post_id,
            "user_id": self.user_id,
            "content": self.content,
            "created_at": self.created_at,
        }

class ForumLike(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    forum_post_id = db.Column(db.Integer, db.ForeignKey('forum_post.id'), nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    created_at = db.Column(db.DateTime, default=db.func.current_timestamp())

    def __repr__(self) -> str:
        string = f"ID: {self.id}, Forum_Post_ID: {self.forum_post_id}, User_ID: {self.user_id}, Created_At: {self.created_at}"
        return string

    def serialize(self):
        return {
            "id": self.id,
            "forum_post_id": self.forum_post_id,
            "user_id": self.user_id,
            "created_at": self.created_at,
        }

class ItemLike(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    item_id = db.Column(db.Integer, db.ForeignKey('item_listing.id'), nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    created_at = db.Column(db.DateTime, default=db.func.current_timestamp())

    def __repr__(self) -> str:
        string = f"ID: {self.id}, Item_ID: {self.item_id}, User_ID: {self.user_id}, Created_At: {self.created_at}"
        return string

    def serialize(self):
        return {
            "id": self.id,
            "item_id": self.item_id,
            "user_id": self.user_id,
            "created_at": self.created_at,
        }

