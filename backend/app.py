from flask import Flask, render_template, request, redirect, url_for, make_response, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS, cross_origin
from models import db, User, ItemListing, ForumPost, ForumComment, ForumLike, ItemLike, ItemOffer
from datetime import datetime, timedelta
import os
from google.auth.transport import requests
from google.oauth2 import id_token
import jwt
from functools import wraps
import base64


app = Flask(__name__)

# Configure database
app.config['CACHE_TYPE'] = 'null' # disable if in production environment
app.config['SECRET_KEY'] = os.getenv('JWT_SECRET_KEY', 'super-secret-key')
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///database.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

# Enable CORS
CORS(app, supports_credentials=True, origins= "http://localhost:5173")

mock_users = [
    {
        "id": 1,
        "name": "Billy Bob",
        "email": "bbob7@swarthmore.edu",
        "created_at": "2023-10-01 12:00:00",
        "profile_picture_url": "https://t4.ftcdn.net/jpg/00/56/93/53/360_F_56935312_NiqxkRKOdGSJd86Tc2uLycL9fkUsIlRW.jpg",
        "bio": "Hi, I'm Billy Bob! I love thrifting and finding unique pieces. I enjoy playing the guitar, cooking, and traveling.",
    },
     {
        "id": 2,
        "name": "John Doe",
        "email": "jdoe6@swarthmore.edu",
        "created_at": "2025-12-01 12:00:00",
        "profile_picture_url": "https://thumbs.dreamstime.com/b/cool-kid-10482439.jpg",
        "bio": "Yo I'm John. Who are you?",
    },
     {
        "id": 3,
        "name": "Summit Pradhan",
        "email": "spradha1@swarthmore.edu",
        "created_at": "2025-12-01 12:00:00",
        "profile_picture_url": "https://thumbs.dreamstime.com/b/mountain-icon-simple-style-white-background-79538820.jpg",
        "bio": "This is Summit. How does this website work???",
    },
]

mock_item_listings = [
    {
        "id": 1,
        "user_id": 1,
        "title": "Denim Jacket",
        "description": "A rugged denim jacket perfect for layering.",
        "price": 59.7,
        "imagePath": "./mock_data_images/mock-item-1.jpg",
        "category": "Jackets",
        "gender": "Unisex",
        "condition": "Good",
        "color": "Blue",
        "size": "M",
        "is_available": False,
    },
    {
        "id": 2,
        "user_id": 1,
        "title": "Nivarna T-Shirt",
        "description": "Classic t-shirt with a vintage Nivarna print.",
        "price": 24.87,
        "imagePath": "./mock_data_images/mock-item-2.jpg",
        "category": "Tops",
        "gender": "Male",
        "condition": "Excellent",
        "color": "Black",
        "size": "L",
    },
    {
        "id": 3,
        "user_id": 1,
        "title": "Cargo Pants",
        "description": "Nice cargo pants with plenty of pockets.",
        "price": 39.5,
        "imagePath": "./mock_data_images/mock-item-3.jpg",
        "category": "Bottoms",
        "gender": "Female",
        "condition": "Fair",
        "color": "Green",
        "size": "S",
    },
    {
        "id": 4,
        "user_id": 1,
        "title": "Nike Airforce 1",
        "description": "Old pair of Nike Airforce 1 sneakers.",
        "price": 50.0,
        "imagePath": "./mock_data_images/mock-item-4.jpg",
        "category": "Shoes",
        "gender": "Unisex",
        "condition": "Good",
        "color": "White",
        "size": "10",
    },
    {
        "id": 5,
        "user_id": 2,
        "title": "Basketball Hat",
        "description": "Lakers basketball hat.",
        "price": 14.0,
        "imagePath": "./mock_data_images/mock-item-5.jpg",
        "category": "Hats",
        "gender": "Unisex",
        "condition": "Good",
        "color": "Purple",
        "size": "",
    },
    {
        "id": 6,
        "user_id": 2,
        "title": "Leather Belt",
        "description": "Leather belt with a sonic design.",
        "price": 19.99,
        "imagePath": "./mock_data_images/mock-item-6.jpg",
        "category": "Accessories",
        "gender": "Male",
        "condition": "Excellent",
        "color": "Black",
        "size": "",
    },
    {
        "id": 7,
        "user_id": 3,
        "title": "Tote Bag",
        "description": "Tote bag with an anime print.",
        "price": 15.99,
        "imagePath": "./mock_data_images/mock-item-7.jpg",
        "category": "Misc",
        "gender": "Unisex",
        "condition": "Excellent",
        "color": "Brown",
        "size": "",
    },
    {
        "id": 8,
        "user_id": 2,
        "title": "Baggy Jeans",
        "description": "Trendy baggy jeans for a casual look.",
        "price": 30.99,
        "imagePath": "./mock_data_images/mock-item-8.jpg",
        "category": "Bottoms",
        "gender": "Female",
        "condition": "Fair",
        "color": "Blue",
        "size": "",
    },
]

mock_item_likes = [
    {
        "id": 1,
        "user_id": 1,
        "item_id": 8,
    },
    {
        "id": 2,
        "user_id": 2,
        "item_id": 1,
    }
]

mock_forum_posts = [
    {
        "id": 1,
        "user_id": 1, # Billy Bob
        "title": "Welcome to the Forum!",
        "content": "Hey everyone, welcome to the new forum section. Feel free to post anything related to thrifting, fashion, or just say hi!",
        "category": "Announcement", 
        "created_at": "2025-04-19 10:00:00",
        "photo_path": None 
    },
     {
        "id": 2,
        "user_id": 2, # John Doe
        "title": "Looking for vintage band tees",
        "content": "Anyone know good spots for finding vintage band t-shirts around campus or online?",
        "category": "General",
        "created_at": "2025-04-20 11:30:00",
        "photo_path": None 
    },
     {
        "id": 3,
        "user_id": 1, # Billy Bob
        "title": "Rate my recent haul!",
        "content": "Found some amazing pieces at the local thrift store today. What do you think?",
        "category": "Fitcheck",
        "created_at": "2025-04-20 14:00:00",
        "photo_path": "./mock_data_images/mock-item-1.jpg" 
    },
]

mock_item_offers = [
    {
        "item_id": 1,
        "seller_id": 1,
        "buyer_id": 3,
        "offer_amount": 50.00,
    },
    {
        "item_id": 7,
        "seller_id": 3,
        "buyer_id": 2,
        "offer_amount": 30.00,
        "status": "Accepted",
        "buyer_completed": True,
    },
    {
        "item_id": 2,
        "seller_id": 1,
        "buyer_id": 3,
        "offer_amount": 20.00,
        "status": "Accepted",
        "seller_completed": True,
    },
    {
        "item_id": 3,
        "seller_id": 1,
        "buyer_id": 3,
        "offer_amount": 15.00,
        "status": "Declined"
    },
    {
        "item_id": 7,
        "seller_id": 3,
        "buyer_id": 1,
        "offer_amount": 25.00,
        "status": "Pending"
    },
    {
        "item_id": 7,
        "seller_id": 3,
        "buyer_id": 3,
        "offer_amount": 25.00,
        "status": "Pending"
    },

]




def add_mock_data():
    # insert user mock data
    for user_data in mock_users:
        # Convert the created_at string into a datetime object
        created_at = datetime.strptime(user_data["created_at"], "%Y-%m-%d %H:%M:%S")
        
        # Create a new User instance
        user = User(
            id=user_data["id"],
            name=user_data["name"],
            email=user_data["email"],
            created_at=created_at,
            bio=user_data.get("bio"),
            profile_picture_url=user_data.get("profile_picture_url"),
        )
        db.session.add(user)
    db.session.commit()

    # insert item listing mock data
    for item in mock_item_listings:
        image_path = item.get("imagePath")
        picture_data = None
        if not image_path or not os.path.exists(image_path):
            print(f"Warning: Image file not found for item {item['id']} at {image_path}.")
            continue

        # Open the image file in binary mode
        with open(image_path, "rb") as f:
            picture_data = f.read()

        new_item = ItemListing(
            id=item["id"],
            user_id=item["user_id"],
            title=item["title"],
            description=item["description"],
            price=item["price"],
            color=item["color"],
            size=item["size"],
            gender=item["gender"],
            condition=item["condition"],
            category=item["category"],
            picture_data=picture_data,
            is_available=item.get("is_available", True)
        )
        db.session.add(new_item)
    db.session.commit()

    # insert item like mock data
    for like in mock_item_likes:
        user_exists = db.session.query(User.id).filter_by(id=like["user_id"]).first() is not None
        item_exists = db.session.query(ItemListing.id).filter_by(id=like["item_id"]).first() is not None
        if user_exists and item_exists:
            item_like = ItemLike(
                id=like["id"],
                user_id=like["user_id"],
                item_id=like["item_id"]
            )
        db.session.add(item_like)
    db.session.commit()

    print("Mock data successfully added to the database.")

    for post_data in mock_forum_posts:
        created_at = datetime.strptime(post_data["created_at"], "%Y-%m-%d %H:%M:%S")
        photo_data = None
        if post_data["photo_path"] and os.path.exists(post_data["photo_path"]):
            with open(post_data["photo_path"], "rb") as f:
                photo_data = f.read()
        elif post_data["photo_path"]:
            print(f"Warning: Photo file not found for forum post {post_data['id']} at {post_data['photo_path']}. Skipping photo for this post.")

        user_exists = db.session.query(User.id).filter_by(id=post_data["user_id"]).first() is not None
        if user_exists:
            new_post = ForumPost(
                id=post_data["id"],
                user_id=post_data["user_id"],
                title=post_data["title"],
                content=post_data["content"],
                category=post_data["category"],
                photo_data=photo_data, 
                created_at=created_at
            )
            db.session.add(new_post)
        else:
            print(f"Warning: Skipping mock forum post {post_data['id']} - User {post_data['user_id']} not found.")
    db.session.commit()

    # insert item offer mock data
    for offer in mock_item_offers:
        item_offer = ItemOffer(
            item_id=offer["item_id"],
            seller_id=offer["seller_id"],
            buyer_id=offer["buyer_id"],
            offer_amount=offer["offer_amount"],
            status=offer.get("status", "Pending"),
            buyer_completed=offer.get("buyer_completed", False),
            seller_completed=offer.get("seller_completed", False)
        )
        db.session.add(item_offer)

    db.session.commit()

    print("Mock data successfully added to the database.")



# Initialize db to be used with current Flask app
#initialize using function
def init_database():
    with app.app_context():
        db.init_app(app)

        # Drop any existing tables for a clean start
        db.drop_all() 

        # Create the database if it doesn't exist
        # Note: create_all does NOT update tables if they are already in the database. 
        # If you change a model’s columns, use a migration library like Alembic with Flask-Alembic 
        # or Flask-Migrate to generate migrations that update the database schema.
        db.create_all()

        # add mock data to the database
        add_mock_data()



# Auth helper function to verify and decode JWT tokens
def decode_access_token(token):
    try:
        data = jwt.decode(token, app.config['SECRET_KEY'], algorithms=['HS256'])
    except ValueError as e:
        return None
    return data

# Decorator to check if the user is authenticated
# Returns token_data to the function if authenticated, otherwise returns 401
def validate_authentication():
    def decorator(f):
        @wraps(f)
        def decorated_function(*args, **kwargs):
            token = request.cookies.get('access_token')
            if not token:
                print("ERROR: No token found")
                return make_response(jsonify({"error": "Not authenticated"}), 401)
            
            token_data = decode_access_token(token)
            if not token_data:
                print("ERROR: Invalid token")
                return make_response(jsonify({"error": "Invalid authentication token"}), 401)
            
            # Check that the user_id exists in the database
            user = User.query.filter_by(id=token_data['user_id']).first()
            if not user:
                print("ERROR: User not found")
                return make_response(jsonify({"error": "Authenticated user not found"}), 401)
            
            # Pass token data to the route handler
            return f(token_data, *args, **kwargs)
        return decorated_function
    return decorator

## STORE ITEMS 
@app.route('/api/store-items', methods=['GET'])
@validate_authentication()
def get_store_items(token_data):
    auth_user_id = token_data['user_id']
    # return all items in order of most recent that are available
    items = ItemListing.query.order_by(ItemListing.created_at.desc()).filter_by(is_available=True).all()
    items_list = [item.serialize() for item in items]
    # also fetch whether the user has liked the item and total like count
    for item in items_list:
        item["liked"] = ItemLike.query.filter_by(item_id=item["id"], user_id=token_data["user_id"]).first() is not None
        item["like_count"] = ItemLike.query.filter_by(item_id=item["id"]).count()

    # NOTE: should probably paginate this in the future, oh well
    return make_response(jsonify(items_list), 200)

@app.route('/api/store-items/<int:item_id>', methods=['GET'])
@validate_authentication()
def get_store_item(token_data, item_id): 
    auth_user_id = token_data['user_id']
    # also fetch User data (name, email)
    item = ItemListing.query.filter_by(id=item_id).first()
    if not item:
        return make_response(jsonify({"error": "Item not found"}), 404)
    user = User.query.filter_by(id=item.user_id).first()
    if not user:
        return make_response(jsonify({"error": "User of listed item not found"}), 404)
    item_data = item.serialize()
    user_data = user.serialize()
    # Response includes all of item data and user name + email
    response = item_data.copy() 
    response["user_name"] = user_data["name"]

    # also fetch whether the user has liked the item and total like count
    response["liked"] = ItemLike.query.filter_by(item_id=item_id, user_id=auth_user_id).first() is not None
    response["like_count"] = ItemLike.query.filter_by(item_id=item_id).count()

    # also fetch whether the user has made an offer on the item
    response["current_user_made_offer"] = ItemOffer.query.filter_by(item_id=item_id, buyer_id=auth_user_id).first() is not None

    return make_response(jsonify(response), 200)

# USER
@app.route('/api/user/<int:user_id>', methods=['GET'])
@validate_authentication()
def get_user(token_data, user_id):
    token = request.cookies.get('access_token')
    if not token:
        print("STORE ITEMS: No token found")
        return make_response(jsonify({"error":"Not authenticated"}), 401)
    token_data = decode_access_token(token)
    if not token_data:
        print("STORE ITEMS: Invalid token")
        return make_response(jsonify({"error":"Invalid authentication token"}), 401)
    # user must be logged in to view store items
    token = request.cookies.get('access_token')

    user = User.query.filter_by(id=user_id).first()
    if not user:
        return make_response(jsonify({"error": "User not found"}), 404)
    return make_response(jsonify(user.serialize()), 200)

## STORE ITEMS BY USER (for profile page)
@app.route('/api/user/<int:user_id>/store-items', methods=['GET'])
@validate_authentication()
def get_user_items(token_data, user_id):
    auth_user_id = token_data['user_id']
    user = User.query.filter_by(id=user_id).first()
    if not user:
        return make_response(jsonify({"error": "User not found"}), 404)
    items = ItemListing.query.filter_by(user_id=user_id).all()
    items_list = [item.serialize() for item in items]

    # also fetch whether the auth has liked the item and total like count
    for item in items_list:
        item["liked"] = ItemLike.query.filter_by(item_id=item["id"], user_id=auth_user_id).first() is not None
        item["like_count"] = ItemLike.query.filter_by(item_id=item["id"]).count()
    return make_response(jsonify(items_list), 200)

# UPLOAD STORE ITEM
@app.route('/api/store-items', methods=['POST'])
@validate_authentication()
def upload_store_item(token_data):
    # verify that the id from the token matches the user_id in the request
    user_id = request.form.get('user_id')
    if not user_id or int(user_id) != token_data['user_id']:
        print("ERROR: User ID from token does not match user ID in request")
        return make_response(jsonify({"error": "User ID mismatch"}), 403)
    
    picture_file = request.files.get('picture_file')
    if not picture_file:
        print("Picture file not found in request")
        return make_response(jsonify({"error": "No picture file uploaded"}), 400)

    title = request.form.get('title')
    description = request.form.get('description')
    price = request.form.get('price')
    color = request.form.get('color')
    gender = request.form.get('gender')
    size = request.form.get('size')
    condition = request.form.get('condition')
    category = request.form.get('category')

    # Check if all required fields are present
    if not all([id, user_id, title, description, price, color, gender, size, condition, category]):
        print("Missing required fields in request")
        return make_response(jsonify({"error": "Missing required fields"}), 400)

    picture_data = picture_file.read()

    # Create ItemListing instance
    new_item = ItemListing(
        user_id=user_id,
        title=title,
        description=description,
        price=price,
        color=color,
        gender=gender,
        size=size,
        condition=condition,
        category=category,
        picture_data=picture_data
    )

    # Add to db session and commit
    try:
        db.session.add(new_item)
        db.session.commit()
    except Exception as e:
        db.session.rollback()
        return make_response(jsonify({"error": str(e)}), 500)

    temp_response = {"message": "Item successfully uploaded!"}
    return make_response(jsonify(temp_response), 201)

@app.route('/api/login', methods=['POST'])
def login():
    try:
        print("Login request received")
        args = request.get_json() or {}
        google_token = args.get('google_token')
        if not google_token:
            print("ERROR: Missing token")
            return make_response(jsonify({"error": "Token is required"}), 400)

        # Verify that token is valid via Google
        try:
            idinfo = id_token.verify_oauth2_token(
                google_token,
                requests.Request(),
                os.getenv("GOOGLE_CLIENT_ID")
            )
        except ValueError:
            print("ERROR: Invalid token")
            return make_response(jsonify({"error": "Invalid Token"}), 400)

        # Check if the user already exists in the database
        user = User.query.filter_by(email=idinfo['email']).first()

        # If user does not exist, create a new user
        if not user:
            # Issue: The query string from google messes with the image
            raw_picture_url = idinfo.get('picture') or ""
            modified_picture_url = raw_picture_url.split('=', 1)[0] if '=' in raw_picture_url else raw_picture_url
            user = User(
                name=idinfo.get('name'),
                email=idinfo.get('email'),
                bio="",
                profile_picture_url=modified_picture_url,
            )
            db.session.add(user)
            db.session.commit()
            print("LOGIN: New user added to database")

        # Create a new JWT token for the user
        payload = {
            'user_id': user.id,
            'name': user.name,
            'email': user.email,
            'exp': datetime.now() + timedelta(hours=24)
        }
        jwt_token = jwt.encode(payload, app.config['SECRET_KEY'], algorithm='HS256')

        # Create a response and set the JWT as an HttpOnly cookie
        # NOTE: we need to update secure and samesite when deploying to production
        resp = make_response(jsonify({"message": "Login successful"}), 200)
        resp.set_cookie(
            'access_token',
            jwt_token,
            path='/',
            httponly=True,
            secure=False,
            samesite='Lax',
            max_age=24 * 60 * 60
        )

        # Re-apply CORS headers for credentialed requests
        resp.headers["Access-Control-Allow-Origin"] = "http://localhost:5173"
        resp.headers["Access-Control-Allow-Credentials"] = "true"

        return resp

    except Exception as error:
        print(error)
        return make_response(jsonify({"error": str(error)}), 400)

@app.route('/api/logout', methods=['POST', 'OPTIONS'])
def logout():
    #deletes token cookie from user 
    resp = make_response()
    if "access_token" in request.cookies:
        resp.set_cookie('access_token', '', expires=0, secure=True, samesite="None", httponly=True)
    return resp

# Get the current user's information (aka "me")
@app.route('/api/me', methods=['GET', 'OPTIONS'])
def me():
    # validate that the JWT exists and is valid
    token = request.cookies.get('access_token')
    if not token:
        print("ERROR: No token found")
        return jsonify({"error":"Not authenticated"}), 401
    try:
        data = jwt.decode(token, app.config['SECRET_KEY'], algorithms=['HS256'])
    except jwt.ExpiredSignatureError:
        print("ERROR: Token expired")
        return jsonify({"error":"Token expired"}), 401
    # get user info from the database
    user = User.query.filter_by(id=data['user_id']).first()
    if not user:
        print("ERROR: User not found")
        return jsonify({"error":"User not found"}), 404
    # return user info
    return jsonify({"user_data": user.serialize()}), 200

@app.route('/api/store-items/<int:item_id>/like', methods=['POST'])
@validate_authentication()
def like_store_item(token_data, item_id):
    user_id = token_data['user_id']

    # Check if the item exists
    item = ItemListing.query.filter_by(id=item_id).first()
    if not item:
        return make_response(jsonify({"error": "Item not found"}), 404)

    # If user already has liked the item, unlike it
    existing_like = ItemLike.query.filter_by(item_id=item_id, user_id=user_id).first()
    if existing_like:
        db.session.delete(existing_like)
        db.session.commit()
        return make_response(jsonify({"message": "Item unliked successfully"}), 200)

    # Otherwise, create a new like
    new_like = ItemLike(item_id=item_id, user_id=user_id)
    db.session.add(new_like)
    db.session.commit()

    return make_response(jsonify({"message": "Item liked successfully"}), 200)

@app.route('/api/user/<int:user_id>/liked-items', methods=['GET'])
@validate_authentication()
def get_user_likes(token_data, user_id):
    auth_user_id = token_data['user_id']
    # Fetch all items the user liked in descending order of creation
    user_likes = ItemLike.query.filter_by(user_id=user_id).order_by(ItemLike.created_at.desc()).all()
    liked_items_list = []
    for like in user_likes:
        item = ItemListing.query.filter_by(id=like.item_id).first()
        if item:
            liked_item = item.serialize()
            # Check if the authenticated user has liked the item
            liked_item["liked"] = ItemLike.query.filter_by(item_id=item.id, user_id=auth_user_id).first() is not None
            liked_item["like_count"] = ItemLike.query.filter_by(item_id=item.id).count()
            liked_items_list.append(liked_item)
    return make_response(jsonify(liked_items_list), 200)

@app.route('/api/store-items/<int:item_id>', methods=['DELETE'])
@validate_authentication()
def delete_store_item(token_data, item_id):
    auth_user_id = token_data['user_id']
    # Check if the item exists
    item = ItemListing.query.filter_by(id=item_id).first()
    if not item:
        return make_response(jsonify({"error": "Item not found"}), 404)

    # Check if the authenticated user is the owner of the item
    if item.user_id != auth_user_id:
        return make_response(jsonify({"error": "You do not have permission to delete this item"}), 403)

    # Delete the item
    db.session.delete(item)
    db.session.commit()

    return make_response(jsonify({"message": "Item deleted successfully"}), 200)

@app.route('/api/user/<int:user_id>/bio', methods=['PUT'])
@validate_authentication()
def update_user_bio(token_data, user_id):
    auth_user_id = token_data['user_id']
    # Check if the authenticated user is the owner of the profile
    if auth_user_id != user_id:
        return make_response(jsonify({"error": "You do not have permission to update this bio"}), 403)

    # Get the new bio from the request
    new_bio = request.json.get('bio')
    if new_bio is None:
        return make_response(jsonify({"error": "Bio is required"}), 400)

    # Update the user's bio in the database
    user = User.query.filter_by(id=user_id).first()
    if not user:
        return make_response(jsonify({"error": "User not found"}), 404)

    user.bio = new_bio
    db.session.commit()

    return make_response(jsonify({"message": "Bio updated successfully"}), 200)

# Offers
@app.route('/api/store-items/<int:item_id>/offer', methods=['POST'])
@validate_authentication()
def make_offer(token_data, item_id):
    buyer_id = token_data['user_id']

    # Check if the item exists
    item = ItemListing.query.filter_by(id=item_id).first()
    if not item:
        return make_response(jsonify({"error": "Item not found"}), 404)
    
    seller_id = item.user_id
    
    # Check if the user is the owner of the item
    if seller_id == buyer_id:
        return make_response(jsonify({"error": "You cannot make an offer on your own item"}), 403)
    
    # Check if the offer amount is provided
    offer_amount = request.json.get('offer_amount')
    if offer_amount is None:
        return make_response(jsonify({"error": "Offer amount is required"}), 400)

    # Create a new offer
    offer = ItemOffer(
        item_id=item_id,
        seller_id=seller_id,
        buyer_id=buyer_id,
        offer_amount=offer_amount
    )
    db.session.add(offer)
    db.session.commit()

    return make_response(jsonify({"message": "Offer made successfully"}), 200)

@app.route('/api/user/<int:user_id>/offers-made', methods=['GET'])
@validate_authentication()
def get_user_offers(token_data, user_id):
    buyer_id = token_data['user_id']
    # Check if the authenticated user is the owner of the profile
    if buyer_id != user_id:
        return make_response(jsonify({"error": "You do not have permission to view this user's offers"}), 403)
    

    # Fetch all offers made by the user
    offers = ItemOffer.query.filter_by(buyer_id=buyer_id).all()
    offers_list = []

    for offer in offers:
        offer_data = offer.serialize()
        # Fetch the item associated with the offer
        item = ItemListing.query.filter_by(id=offer.item_id).first()
        if not item:
            continue
        item_data = item.serialize()
        seller_id = item.user_id

        # Fetch the user who listed the item
        item_seller = User.query.filter_by(id=seller_id).first()
        if not item_seller:
            continue
        item_seller_data = item_seller.serialize()

        # Add item and seller information to the offer data
        offer_data["item_title"] = item_data["title"]
        offer_data["item_price"] = item_data["price"]
        offer_data["item_picture_data"] = item_data["picture_data"]
        offer_data["seller_name"] = item_seller_data["name"]
        offer_data["seller_profile_picture_url"] = item_seller_data["profile_picture_url"]

        # If offer is accepted, add the seller's contact information, otherwise leave it blank
        offer_data["seller_contact"] = item_seller_data["email"] if offer.status == "Accepted" else ""
        offers_list.append(offer_data)

        # Also add completion status
        offer_data["buyer_completed"] = offer.buyer_completed
        offer_data["seller_completed"] = offer.seller_completed

    return make_response(jsonify(offers_list), 200)

@app.route('/api/user/<int:user_id>/offers-received', methods=['GET'])
@validate_authentication()
def get_user_received_offers(token_data, user_id):
    auth_user_id = token_data['user_id']
    # Check if the authenticated user is the owner of the profile
    if auth_user_id != user_id:
        return make_response(jsonify({"error": "You do not have permission to view this user's offers"}), 403)
    # Fetch all offers received by the user
    offers = ItemOffer.query.filter_by(seller_id=user_id).all()
    offers_list = []
    for offer in offers:
        offer_data = offer.serialize()
        # Fetch the item associated with the offer
        item = ItemListing.query.filter_by(id=offer.item_id).first()
        if not item:
            continue
        item_data = item.serialize()

        # Fetch the user who made the offer
        buyer = User.query.filter_by(id=offer.buyer_id).first()
        if not buyer:
            continue
        buyer_data = buyer.serialize()

        # Add item and buyer information to the offer data
        offer_data["item_title"] = item_data["title"]
        offer_data["item_price"] = item_data["price"]
        offer_data["item_picture_data"] = item_data["picture_data"]
        offer_data["buyer_name"] = buyer_data["name"]
        offer_data["buyer_profile_picture_url"] = buyer_data["profile_picture_url"]

        # If offer is accepted, add the buyer's contact information, otherwise leave it blank
        offer_data["buyer_contact"] = buyer_data["email"] if offer.status == "Accepted" else ""

        # Also add completion status
        offer_data["buyer_completed"] = offer.buyer_completed
        offer_data["seller_completed"] = offer.seller_completed

        offers_list.append(offer_data)
    
    return make_response(jsonify(offers_list), 200)

# Endpoint for seller to accept an offer
@app.route('/api/offers/<int:offer_id>/accept', methods=['PUT'])
@validate_authentication()
def accept_offer(token_data, offer_id):
    auth_user_id = token_data['user_id']
    # Check if the authenticated user is the seller of the offer
    offer = ItemOffer.query.filter_by(id=offer_id, seller_id=auth_user_id).first()
    if not offer:
        return make_response(jsonify({"error": "Offer not found or you do not have permission to accept this offer"}), 403)
    
    # Check that the offer is still pending
    if offer.status != "Pending":
        return make_response(jsonify({"error": "Offer has already been accepted or declined"}), 400)

    # Update the offer status to accepted
    offer.status = "Accepted"
    db.session.commit()

    # Get the contact information of the buyer
    buyer = User.query.filter_by(id=offer.buyer_id).first()
    if not buyer:
        return make_response(jsonify({"error": "Buyer not found"}), 404)

    return make_response(jsonify({"message": "Offer accepted successfully", "buyer_contact": buyer.email}), 200)

# Endpoint for seller to decline an offer
@app.route('/api/offers/<int:offer_id>/decline', methods=['PUT'])
@validate_authentication()
def decline_offer(token_data, offer_id):
    auth_user_id = token_data['user_id']
    # Check if the authenticated user is the seller of the offer
    offer = ItemOffer.query.filter_by(id=offer_id, seller_id=auth_user_id).first()
    if not offer:
        return make_response(jsonify({"error": "Offer not found or you do not have permission to decline this offer"}), 403)
    
    # Check that the offer is still pending
    if offer.status != "Pending":
        return make_response(jsonify({"error": "Offer has already been accepted or declined"}), 400)

    # Update the offer status to declined
    offer.status = "Declined"
    db.session.commit()

    return make_response(jsonify({"message": "Offer declined successfully"}), 200)

# Endpoint for buyer to mark offer as complete
@app.route('/api/offers/<int:offer_id>/complete-buyer', methods=['PUT'])
@validate_authentication()
def complete_offer_buyer(token_data, offer_id):
    user_id = token_data['user_id']
    # must be the buyer
    offer = ItemOffer.query.filter_by(id=offer_id, buyer_id=user_id).first()
    if not offer:
        return make_response(jsonify({"error": "Offer not found or you are not the buyer"}), 403)

    if offer.buyer_completed:
        return make_response(jsonify({"message": "Buyer already marked as complete"}), 400)

    offer.buyer_completed = True

    # if seller already did theirs, finalize
    if offer.seller_completed:
        offer.status = "Completed"
        offer.item.is_available = False

    # for all other offers to this item, set them to "Declined"
    other_offers = ItemOffer.query.filter_by(item_id=offer.item_id, status="Pending").all()
    for offer in other_offers:
        offer.status = "Declined"

    db.session.commit()

    return make_response(jsonify({"message": "Buyer completion recorded"}), 200)

# Endpoint for seller to mark offer as complete
@app.route('/api/offers/<int:offer_id>/complete-seller', methods=['PUT'])
@validate_authentication()
def complete_offer_seller(token_data, offer_id):
    user_id = token_data['user_id']
    # must be the seller
    offer = ItemOffer.query.filter_by(id=offer_id, seller_id=user_id).first()
    if not offer:
        return make_response(jsonify({"error": "Offer not found or you are not the seller"}), 403)

    if offer.seller_completed:
        return make_response(jsonify({"message": "Seller already marked as complete"}), 400)

    offer.seller_completed = True

    # if buyer already did theirs, finalize
    if offer.buyer_completed:
        offer.status = "Completed"
        offer.item.is_available = False

    # for all other offers to this item, set them to "Declined"
    other_offers = ItemOffer.query.filter_by(item_id=offer.item_id, status="Pending").all()
    for offer in other_offers:
        offer.status = "Declined"

    db.session.commit()
    return make_response(jsonify({"message": "Seller completion recorded"}), 200)

# Endpoint for buyer to cancel pending offer
@app.route('/api/offers/<int:offer_id>/delete-pending', methods=['DELETE'])
@validate_authentication()
def cancel_offer_pending(token_data, offer_id):
    auth_user_id = token_data['user_id']
    # Check if the authenticated user is the buyer of the offer
    offer = ItemOffer.query.filter_by(id=offer_id, buyer_id=auth_user_id).first()
    if not offer:
        return make_response(jsonify({"error": "Offer not found or you do not have permission to decline this offer"}), 403)
    
    # Check that the offer is still pending
    if offer.status != "Pending":
        return make_response(jsonify({"error": "Offer has already been accepted or declined"}), 400)
    
    # Delete the offer
    db.session.delete(offer)
    db.session.commit()

    return make_response(jsonify({"message": "Offer complete successfully"}), 200)

# Endpoint for buyer/seller to cancel accepted offer
@app.route('/api/offers/<offer_id>/cancel-accepted', methods=['PUT'])
@validate_authentication()
def cancel_offer_accepted(token_data, offer_id):
    auth_user_id = token_data['user_id']
    # Check if the authenticated user is the buyer or seller of the offer
    offer = ItemOffer.query.filter_by(id=offer_id).first()
    if not offer:
        return make_response(jsonify({"error": "Offer not found"}), 404)

    if offer.seller_id != auth_user_id and offer.buyer_id != auth_user_id:
        return make_response(jsonify({"error": "You do not have permission to cancel this offer"}), 403)

    # Set the offer status to "Cancelled"
    offer.status = "Cancelled"

    # Reset the completion status
    offer.buyer_completed = False
    offer.seller_completed = False
    db.session.commit()

    return make_response(jsonify({"message": "Offer cancelled successfully"}), 200)


@app.route('/api/forum/posts', methods=['GET'])
def get_forum_posts():
    try:
        posts = ForumPost.query.order_by(ForumPost.created_at.desc()).all()
        posts_list = [post.serialize() for post in posts]
        return jsonify(posts_list), 200
    except Exception as e:
        print(f"Error fetching forum posts: {e}")
        return jsonify({"error": "An error occurred while fetching forum posts"}), 500


@app.route('/api/forum/posts/<int:post_id>', methods=['GET'])
def get_single_forum_post(post_id):
    try:
        post = ForumPost.query.get(post_id) 
        if not post:
            return jsonify({"error": "Forum post not found"}), 404

        post_data = post.serialize()

        comments = ForumComment.query\
        .filter_by(forum_post_id=post_id)\
        .order_by(ForumComment.created_at.desc())\
        .all()
        post_data["comments"] = [c.serialize() for c in comments]

        return jsonify(post_data), 200
    except Exception as e:
        print(f"Error fetching single forum post {post_id}: {e}")
        return jsonify({"error": "An error occurred while fetching the forum post"}), 500


@app.route('/api/forum/posts', methods=['POST'])
@validate_authentication() 
def create_forum_post(token_data):
    user_id = token_data['user_id']
    title = request.form.get('title')
    content = request.form.get('content')
    category = request.form.get('category')
    photo_file = request.files.get('photo')

    if not title or not content or not category:
        return jsonify({"error": "Title, content, and category are required"}), 400

    allowed_categories = ["General", "Announcement", "Event", "Fitcheck"] 
    if category not in allowed_categories:
         return jsonify({"error": f"Invalid category: {category}"}), 400

    photo_data = None
    if photo_file:
        photo_data = photo_file.read()
    else:
        photo_data  = None


    try:
        new_post = ForumPost(
            title=title,
            content=content,
            user_id=user_id,
            category=category, 
            photo_data=photo_data 
        )

        db.session.add(new_post)
        db.session.commit()

        return jsonify(new_post.serialize()), 201

    except Exception as e:
        db.session.rollback()
        print(f"Error creating forum post: {e}") 
        return jsonify({"error": "An error occurred while creating the forum post"}), 500
    
@app.route('/api/forum/posts/<int:post_id>/comments', methods=['POST'])
@validate_authentication()
def create_comment(token_data, post_id):
    user_id = token_data['user_id']
    data = request.get_json() or {}
    content = data.get('content')
    if not content:
        return jsonify({"error": "Content is required"}), 400

    new_comment = ForumComment(
        forum_post_id=post_id,
        user_id=user_id,
        content=content
    )
    db.session.add(new_comment)
    db.session.commit()
    return jsonify(new_comment.serialize()), 201


if __name__ == '__main__':
    init_database()
    app.run(host="localhost", port="5001", debug=True)