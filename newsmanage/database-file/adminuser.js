/*
 Navicat Premium Dump Script

 Source Server         : aiNews
 Source Server Type    : MongoDB
 Source Server Version : 80013 (8.0.13)
 Source Host           : localhost:27017
 Source Schema         : ai-news

 Target Server Type    : MongoDB
 Target Server Version : 80013 (8.0.13)
 File Encoding         : 65001

 Date: 31/08/2025 00:34:16
*/


// ----------------------------
// Collection structure for adminuser
// ----------------------------
db.getCollection("adminuser").drop();
db.createCollection("adminuser");

// ----------------------------
// Documents of adminuser
// ----------------------------
db.getCollection("adminuser").insert([ {
    _id: ObjectId("68b30c5a08d6d3af65debbaa"),
    username: "admin",
    password: "$2a$10$2RJLX5Bey0BLxP96IWTBzeN6UieGe6GuGkFYP8.FLY8HQKh0jTavm",
    email: "admin@example.com",
    role: "admin",
    isActive: true,
    createdAt: ISODate("2025-08-30T14:36:10.874Z"),
    updatedAt: ISODate("2025-08-30T14:36:10.874Z"),
    lastLogin: ISODate("2025-08-30T14:49:36.944Z")
} ]);
