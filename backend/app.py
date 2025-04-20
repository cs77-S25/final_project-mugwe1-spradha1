from flask import Flask, render_template, request, redirect, url_for, make_response, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS, cross_origin
from models import db, User, ItemListing, ForumPost, ForumComment, ForumLike, ItemLike
from datetime import datetime
import os
from google.auth.transport import requests
from google.oauth2 import id_token
import jwt
from datetime import timedelta
from functools import wraps


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
        "id": 0,
        "name": "Billy Bob",
        "email": "bbob7@swarthmore.edu",
        "created_at": "2023-10-01 12:00:00",
        "profile_picture_url": "https://t4.ftcdn.net/jpg/00/56/93/53/360_F_56935312_NiqxkRKOdGSJd86Tc2uLycL9fkUsIlRW.jpg",
        "bio": "Hi, I'm Billy Bob! I love thrifting and finding unique pieces. I enjoy playing the guitar, cooking, and traveling.",
    },
     {
        "id": 1,
        "name": "John Doe",
        "email": "jdoe6@swarthmore.edu",
        "created_at": "2025-12-01 12:00:00",
        "profile_picture_url": "https://thumbs.dreamstime.com/b/cool-kid-10482439.jpg",
        "bio": "Yo I'm John. Who are you?",
    },
     {
        "id": 2,
        "name": "Summit Pradhan",
        "email": "spradha1@swarthmore.edu",
        "created_at": "2025-12-01 12:00:00",
        "profile_picture_url": "https://thumbs.dreamstime.com/b/mountain-icon-simple-style-white-background-79538820.jpg",
        "bio": "This is Summit. How does this website work???",
    },
]

mock_item_listings = [
    {
        "id": 0,
        "user_id": 0,
        "title": "Denim Jacket",
        "description": "A rugged denim jacket perfect for layering.",
        "price": 59.7,
        "imagePath": "./mock_data_images/mock-item-1.jpg",
        "category": "Jackets",
        "gender": "Unisex",
        "condition": "Good",
        "color": "Blue",
        "size": "M",
    },
    {
        "id": 1,
        "user_id": 0,
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
        "id": 2,
        "user_id": 0,
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
        "id": 3,
        "user_id": 0,
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
        "id": 4,
        "user_id": 1,
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
        "id": 5,
        "user_id": 1,
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
        "id": 6,
        "user_id": 2,
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
        "id": 7,
        "user_id": 1,
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
        "id": 0,
        "user_id": 0,
        "item_id": 7,
    },
    {
        "id": 1,
        "user_id": 1,
        "item_id": 0,
    }
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
            profile_picture_url=user_data.get("profile_picture_url")
        )
        db.session.add(user)
    db.session.commit()

    # insert item listing mock data
    for item in mock_item_listings:
        image_path = item.get("imagePath")
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
            picture_data=picture_data
        )
        db.session.add(new_item)
    db.session.commit()

    # insert item like mock data
    for like in mock_item_likes:
        item_like = ItemLike(
            id=like["id"],
            user_id=like["user_id"],
            item_id=like["item_id"]
        )
        db.session.add(item_like)
    db.session.commit()

    print("Mock data successfully added to the database.")

# Initialize db to be used with current Flask app
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
            
            # Pass token data to the route handler
            return f(token_data, *args, **kwargs)
        return decorated_function
    return decorator

## STORE ITEMS 
@app.route('/store-items', methods=['GET'])
@validate_authentication()
def get_store_items(token_data):
    # return all items in order of most recent
    items = ItemListing.query.order_by(ItemListing.created_at.desc()).all()
    items_list = [item.serialize() for item in items]
    # also fetch whether the user has liked the item and total like count
    for item in items_list:
        item["liked"] = ItemLike.query.filter_by(item_id=item["id"], user_id=token_data["user_id"]).first() is not None
        item["like_count"] = ItemLike.query.filter_by(item_id=item["id"]).count()

    # NOTE: should probably paginate this in the future, oh well
    return make_response(jsonify(items_list), 200)

@app.route('/store-items/<int:item_id>', methods=['GET'])
@validate_authentication()
def get_store_item(token_data, item_id): 
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
    response["user_email"] = user_data["email"]

    # also fetch whether the user has liked the item and total like count
    response["liked"] = ItemLike.query.filter_by(item_id=item_id, user_id=token_data["user_id"]).first() is not None
    response["like_count"] = ItemLike.query.filter_by(item_id=item_id).count()
    return make_response(jsonify(response), 200)

# USER
@app.route('/user/<int:user_id>', methods=['GET'])
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
@app.route('/user/<int:user_id>/store-items', methods=['GET'])
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
@app.route('/store-items', methods=['POST'])
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

@app.route('/login', methods=['POST'])
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

@app.route('/logout', methods=['POST', 'OPTIONS'])
def logout():
    #deletes token cookie from user 
    resp = make_response()
    if "access_token" in request.cookies:
        resp.set_cookie('access_token', '', expires=0, secure=True, samesite="None", httponly=True)
    return resp

# Get the current user's information (aka "me")
@app.route('/me', methods=['GET', 'OPTIONS'])
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

@app.route('/store-items/<int:item_id>/like', methods=['POST'])
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

@app.route('/user/<int:user_id>/liked-items', methods=['GET'])
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

@app.route('/store-items/<int:item_id>', methods=['DELETE'])
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

@app.route('/user/<int:user_id>/bio', methods=['PUT'])
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


if __name__ == '__main__':
    app.run(host="localhost", port="5001", debug=True)
