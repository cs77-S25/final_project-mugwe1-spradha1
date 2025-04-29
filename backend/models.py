from flask_sqlalchemy import SQLAlchemy
import base64
from datetime import datetime

db = SQLAlchemy()
class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(255), unique=True, nullable=False)
    email = db.Column(db.String(255), unique=True, nullable=False)
    created_at = db.Column(db.DateTime, default=db.func.current_timestamp())
    bio = db.Column(db.Text, nullable=True)
    profile_picture_url = db.Column(db.String(255), nullable=True)

    forum_posts = db.relationship('ForumPost', backref='author', lazy=True)
    forum_comments = db.relationship('ForumComment', backref='commenter', lazy=True)
    forum_likes = db.relationship('ForumLike', backref='liker', lazy=True)
    item_listings = db.relationship('ItemListing', backref='seller', lazy=True)
    item_likes = db.relationship('ItemLike', backref='liker', lazy=True)

    def __repr__(self) -> str:
        string = f"ID: {self.id}, Name: {self.name}, Email: {self.email}, Created_At: {self.created_at}, Bio: {self.bio}, Profile_Picture_URL: {self.profile_picture_url}"
        return string

    def serialize(self):
        return {
            "id": self.id,
            "name": self.name,
            "email": self.email,
            "created_at": self.created_at.isoformat() if self.created_at else None,
            "bio": self.bio,
            "profile_picture_url": self.profile_picture_url,
        }

class ItemListing(db.Model):
    __tablename__ = 'item_listing'
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
    is_available = db.Column(db.Boolean, default=True)

    likes = db.relationship('ItemLike', backref='item', lazy=True)
    offers = db.relationship('ItemOffer', back_populates='item', lazy=True)

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
            "is_available": self.is_available,
        }

class ForumPost(db.Model):
    __tablename__ = 'forum_post'
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(255), nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    content = db.Column(db.Text, nullable=False)
    category = db.Column(db.String(50), nullable=False)
    photo_data = db.Column(db.LargeBinary, nullable=True)
    created_at = db.Column(db.DateTime, default=db.func.current_timestamp())

    #explicit definition of relationships
    comments = db.relationship('ForumComment', backref='post', cascade='all, delete-orphan')
    likes = db.relationship('ForumLike', backref='post', lazy=True)

    def __repr__(self) -> str:
        string = f"ID: {self.id}, Title: {self.title}, User_ID: {self.user_id}, Content: {self.content}, Created_At: {self.created_at}"
        return string

    def serialize(self):
        encoded_photo = base64.b64encode(self.photo_data).decode('utf-8') if self.photo_data else None  
        author_name = self.author.name if self.author else "Unknown User"
        
        return {
            "id": self.id,
            "title": self.title,
            "user_id": self.user_id,
            "author_name": author_name,
            "content": self.content,
            "category": self.category, 
            "photo_data": encoded_photo,
            "created_at": self.created_at.isoformat() if self.created_at else None,
        }

class ForumComment(db.Model):
    __tablename__ = 'forum_comment'
    id = db.Column(db.Integer, primary_key=True)
    forum_post_id = db.Column(db.Integer, db.ForeignKey('forum_post.id'), nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    content = db.Column(db.Text, nullable=False)
    created_at = db.Column(db.DateTime, default=db.func.current_timestamp())

    def __repr__(self) -> str:
        string = f"ID: {self.id}, Forum_Post_ID: {self.forum_post_id}, User_ID: {self.user_id}, Content: {self.content}, Created_At: {self.created_at}"
        return string

    def serialize(self):
        commenter_name = self.commenter.name if self.commenter else "Unknown User"

        return {
            "id": self.id,
            "forum_post_id": self.forum_post_id,
            "user_id": self.user_id,
            "commenter_name": commenter_name,
            "content": self.content,
            "created_at": self.created_at.isoformat() if self.created_at else None,
        }

class ForumLike(db.Model):
    __tablename__ = 'forum_like'
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
            "created_at": self.created_at.isoformat() if self.created_at else None,
        }

class ItemLike(db.Model):
    __tablename__ = 'item_like'
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
            "created_at": self.created_at.isoformat() if self.created_at else None,
        }
    
class ItemOffer(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    item_id = db.Column(db.Integer, db.ForeignKey('item_listing.id'), nullable=False)
    buyer_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    seller_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    offer_amount = db.Column(db.Float, nullable=False)
    created_at = db.Column(db.DateTime, default=db.func.current_timestamp())
    status = db.Column(db.String(50), server_default="Pending")  # e.g. "Pending", "Accepted", "Declined", "Completed", "Cancelled"

    # both buyer and seller must confirm the offer
    buyer_completed = db.Column(db.Boolean, default=False)
    seller_completed = db.Column(db.Boolean, default=False)

    # Relationships
    item = db.relationship('ItemListing', back_populates='offers')

    def serialize(self):
        return {
            "id": self.id,
            "item_id": self.item_id,
            "buyer_id": self.buyer_id,
            "seller_id": self.seller_id,
            "offer_amount": self.offer_amount,
            "created_at": self.created_at.isoformat() if self.created_at else None,
            "status": self.status,
            "buyer_completed": self.buyer_completed,
            "seller_completed": self.seller_completed,
        }


