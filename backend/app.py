from flask import Flask, render_template, request, redirect, url_for, make_response, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from models import db, User, ItemListing, ForumPost, ForumComment, ForumLike
from datetime import datetime
import os

app = Flask(__name__)

# Configure database
app.config['CACHE_TYPE'] = 'null' # disable if in production environment
app.config['SECRET_KEY'] = 'secret key'
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///database.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

# Enable CORS
CORS(app)

mock_users = [
    {
        "id": 0,
        "name": "Summit Pradhan",
        "email": "spradha1@swarthmore.edu",
        "created_at": "2023-10-01 12:00:00",
        "bio": "Hi, I'm Summit! I love thrifting and finding unique pieces. I enjoy playing the guitar, cooking, and traveling.",
    },
     {
        "id": 1,
        "name": "John Doe",
        "email": "jdoe6@swarthmore.edu",
        "created_at": "2025-12-01 12:00:00",
        "bio": "Yo I'm John. Who are you?",
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
        "user_id": 1,
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
            bio=user_data.get("bio")
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

@app.route('/store-items', methods=['GET'])
def get_store_items():
    items = ItemListing.query.all()
    items_list = [item.serialize() for item in items]
    return make_response(jsonify(items_list), 200)

@app.route('/store-items/<int:item_id>', methods=['GET'])
def get_store_item(item_id):
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
    return make_response(jsonify(response), 200)

@app.route('/user/<int:user_id>', methods=['GET'])
def get_user(user_id):
    user = User.query.filter_by(id=user_id).first()
    if not user:
        return make_response(jsonify({"error": "User not found"}), 404)
    return make_response(jsonify(user.serialize()), 200)

@app.route('/user/<int:user_id>/store-items', methods=['GET'])
def get_user_items(user_id):
    user = User.query.filter_by(id=user_id).first()
    if not user:
        return make_response(jsonify({"error": "User not found"}), 404)
    items = ItemListing.query.filter_by(user_id=user_id).all()
    items_list = [item.serialize() for item in items]
    return make_response(jsonify(items_list), 200)

# Upload store item 
@app.route('/store-items', methods=['POST'])
def upload_store_item():
    picture_file = request.files.get('picture_file')
    if not picture_file:
        print("Picture file not found in request")
        return make_response(jsonify({"error": "No picture file uploaded"}), 400)

    user_id = request.form.get('user_id')
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





if __name__ == '__main__':
    app.run(debug=True)
