// // seedUser.js
// import mongoose from "mongoose";
// import dotenv from "dotenv";
// import bcrypt from "bcryptjs";
// import User from "./models/User.js"; // adjust path if needed

// dotenv.config();

// const seedUser = async () => {
//   try {
//     // ✅ Connect to MongoDB
//     await mongoose.connect(process.env.MONGO_URI, {
//       useNewUrlParser: true,
//       useUnifiedTopology: true,
//     });

//     const email = "abhishekydv2408@gmail.com"; // unique email for seed user

//     // ✅ Check if user already exists
//     const existingUser = await User.findOne({ email });

//     if (existingUser) {
//       console.log("⚠️  User already exists:", existingUser.email);
//     } else {
//       // ✅ Hash password
//       const hashedPassword = await bcrypt.hash("User@#890", 10);

//       // ✅ Create new seed user
//       const user = new User({
//         name: "Abhishek Yadav",
//         email,
//         password: hashedPassword,
//         role: "user",
//         isVerified: true,
//         profilePic:
//           "https://res.cloudinary.com/demo/image/upload/v1710000000/default-profile.png",
//       });

//       await user.save();
//       console.log("✅ New user seeded successfully:", user.email);
//     }

//     mongoose.connection.close();
//   } catch (error) {
//     console.error("❌ Error seeding user:", error);
//     mongoose.connection.close();
//   }
// };

// seedUser();


// seedUser.js
// import mongoose from "mongoose";
// import dotenv from "dotenv";
// import bcrypt from "bcryptjs";
// import User from "./models/User.js"; // Adjust the path if needed

// dotenv.config();

// const seedUser = async () => {
//   try {
//     // ✅ Connect to MongoDB
//     await mongoose.connect(process.env.MONGO_URI, {
//       useNewUrlParser: true,
//       useUnifiedTopology: true,
//     });
//     console.log("✅ Connected to MongoDB");

//     const email = "admin@example.com"; // Unique email for seed admin user

//     // ✅ Check if the admin user already exists
//     const existingUser = await User.findOne({ email });

//     if (existingUser) {
//       console.log(`⚠️  User already exists: ${existingUser.email}`);
//     } else {
//       // ✅ Generate salt and hash password
//       const salt = await bcrypt.genSalt(10);
//       const hashedPassword = await bcrypt.hash("User123", salt);

//       // ✅ Create new seed admin user
//       const newUser = new User({
//         name: "Adam Miller",
//         email,
//         password: hashedPassword,
//         role: "user",
//         isVerified: true,
//         profilePic:
//           "https://res.cloudinary.com/demo/image/upload/v1710000000/default-profile.png",
//       });

//       await newUser.save();
//       console.log(`✅ New admin user created: ${newUser.email}`);
//     }

//     // ✅ Close MongoDB connection
//     await mongoose.connection.close();
//     console.log("🔒 Database connection closed");
//   } catch (error) {
//     console.error("❌ Error seeding user:", error.message);
//     await mongoose.connection.close();
//   }
// };

// // Run the seeding function
// seedUser();


// import mongoose from "mongoose";
// import Puzzle from "./models/Quiz.js";
// import dotenv from "dotenv";

// dotenv.config();

// const MONGO_URI = process.env.MONGO_URI;



// const seedNetworkingPuzzle = async () => {
//   try {
//     await mongoose.connect(MONGO_URI);
//     console.log("✅ Connected to MongoDB");

//     const networkingPuzzle = new Puzzle({
//       name: "Computer Networking Mastery",
//       description:
//         "Challenge yourself on computer networking concepts from basics to advanced routing and protocols.",
//       category: "Networking",
//       isFree: true,
//       author: "System",
//       tags: ["Networking", "TCP/IP", "OSI", "Protocols", "Network Devices"],
//       numberOfLevels: 3,
//       totalMarks: 15,
//       levels: [
//         {
//           name: "Easy",
//           difficulty: "easy",
//           maxMarks: 5,
//           passingMarks: 3,
//           instructions: "Answer basic networking and OSI model questions.",
//           questions: [
//             {
//               question: "How many layers are there in the OSI model?",
//               options: ["5", "6", "7", "8"],
//               answer: "7",
//               explanation: "The OSI model has 7 layers: Physical to Application.",
//               tags: ["OSI Model"],
//             },
//             {
//               question: "Which device connects different networks together?",
//               options: ["Switch", "Router", "Hub", "Bridge"],
//               answer: "Router",
//               explanation: "A router connects multiple networks and forwards data packets.",
//               tags: ["Router"],
//             },
//             {
//               question: "Which protocol is used to translate domain names to IP addresses?",
//               options: ["HTTP", "DNS", "FTP", "ARP"],
//               answer: "DNS",
//               explanation: "DNS (Domain Name System) converts domain names to IPs.",
//               tags: ["DNS"],
//             },
//             {
//               question: "Which layer is responsible for end-to-end communication?",
//               options: [
//                 "Transport Layer",
//                 "Network Layer",
//                 "Data Link Layer",
//                 "Session Layer",
//               ],
//               answer: "Transport Layer",
//               explanation: "Transport Layer ensures reliable end-to-end delivery.",
//               tags: ["Transport Layer"],
//             },
//             {
//               question: "Which of the following is an example of a MAC address?",
//               options: [
//                 "192.168.1.1",
//                 "255.255.255.0",
//                 "00:1A:2B:3C:4D:5E",
//                 "10.0.0.5",
//               ],
//               answer: "00:1A:2B:3C:4D:5E",
//               explanation: "MAC address uniquely identifies a device at Data Link Layer.",
//               tags: ["MAC Address"],
//             },
//           ],
//         },
//         {
//           name: "Medium",
//           difficulty: "medium",
//           maxMarks: 5,
//           passingMarks: 3,
//           instructions: "Intermediate level questions focusing on IP addressing and protocols.",
//           questions: [
//             {
//               question: "Which protocol provides reliable communication using acknowledgments?",
//               options: ["UDP", "TCP", "ICMP", "IP"],
//               answer: "TCP",
//               explanation: "TCP ensures reliable transmission using acknowledgments.",
//               tags: ["TCP"],
//             },
//             {
//               question: "Which layer is responsible for routing packets?",
//               options: [
//                 "Application Layer",
//                 "Transport Layer",
//                 "Network Layer",
//                 "Data Link Layer",
//               ],
//               answer: "Network Layer",
//               explanation: "Network Layer handles logical addressing and routing.",
//               tags: ["Routing", "Network Layer"],
//             },
//             {
//               question: "What is the default subnet mask for a Class C IP address?",
//               options: [
//                 "255.0.0.0",
//                 "255.255.0.0",
//                 "255.255.255.0",
//                 "255.255.255.255",
//               ],
//               answer: "255.255.255.0",
//               explanation: "Class C IP addresses use 24 bits for the network ID.",
//               tags: ["IP Addressing"],
//             },
//             {
//               question: "Which command is used to test network connectivity?",
//               options: ["ipconfig", "ping", "netstat", "nslookup"],
//               answer: "ping",
//               explanation: "Ping uses ICMP Echo Request to test network reachability.",
//               tags: ["ICMP", "Tools"],
//             },
//             {
//               question: "Which protocol is used for secure file transfer?",
//               options: ["FTP", "TFTP", "SFTP", "SMTP"],
//               answer: "SFTP",
//               explanation: "SFTP encrypts data over SSH for secure file transfer.",
//               tags: ["SFTP"],
//             },
//           ],
//         },
//         {
//           name: "Hard",
//           difficulty: "hard",
//           maxMarks: 5,
//           passingMarks: 3,
//           instructions:
//             "Advanced questions about routing algorithms, protocols, and security concepts.",
//           questions: [
//             {
//               question: "Which protocol is used by routers to exchange routing information within an AS?",
//               options: ["BGP", "OSPF", "RIP", "EIGRP"],
//               answer: "OSPF",
//               explanation: "OSPF is an Interior Gateway Protocol used within an autonomous system.",
//               tags: ["OSPF", "Routing"],
//             },
//             {
//               question: "Which of the following uses distance vector routing?",
//               options: ["RIP", "OSPF", "EIGRP", "BGP"],
//               answer: "RIP",
//               explanation: "RIP uses hop count as its metric and follows the distance vector approach.",
//               tags: ["RIP", "Routing"],
//             },
//             {
//               question: "Which layer is responsible for encryption and decryption of data?",
//               options: ["Transport Layer", "Session Layer", "Presentation Layer", "Application Layer"],
//               answer: "Presentation Layer",
//               explanation: "Presentation Layer ensures data encryption and proper format translation.",
//               tags: ["Encryption", "OSI Model"],
//             },
//             {
//               question: "Which protocol is used to automatically assign IP addresses to devices?",
//               options: ["ARP", "ICMP", "DHCP", "DNS"],
//               answer: "DHCP",
//               explanation: "DHCP automatically assigns IP addresses to clients in a network.",
//               tags: ["DHCP"],
//             },
//             {
//               question: "Which command displays active TCP connections on a system?",
//               options: ["ping", "tracert", "ipconfig", "netstat"],
//               answer: "netstat",
//               explanation: "Netstat shows active connections and listening ports.",
//               tags: ["Networking Tools"],
//             },
//           ],
//         },
//       ],
//     });

//     await networkingPuzzle.save();
//     console.log("🌐 Free Networking Puzzle seeded successfully!");
//   } catch (error) {
//     console.error("❌ Error seeding Networking puzzle:", error);
//   } finally {
//     await mongoose.disconnect();
//     console.log("🔌 Disconnected from MongoDB");
//   }
// };

// seedNetworkingPuzzle();




// import mongoose from "mongoose";
// import dotenv from "dotenv";
// import SubscriptionPlan from "./models/SubscriptionPlan.js";

// // Load environment variables
// dotenv.config();

// // MongoDB connection URI
// const MONGO_URI = process.env.MONGO_URI;

// if (!MONGO_URI) {
//   console.error("Error: MONGO_URI is not defined in .env");
//   process.exit(1);
// }

// // Seed data
// const seedPlans = [
//   {
//     name: "1 Month",
//     durationInDays: 30,
//     price: 99,
//     discountPercentage: 0,
//     discountCodes: [
//       { code: "NEW10", percentage: 10 },
//       { code: "WELCOME5", percentage: 5 }
//     ]
//   },
//   {
//     name: "3 Months",
//     durationInDays: 90,
//     price: 299,
//     discountPercentage: 5,
//     discountCodes: [
//       { code: "SPRING15", percentage: 15 }
//     ]
//   },
//   {
//     name: "6 Months",
//     durationInDays: 180,
//     price: 499,
//     discountPercentage: 10,
//     discountCodes: [
//       { code: "SUMMER20", percentage: 20 }
//     ]
//   },
//   {
//     name: "1 Year",
//     durationInDays: 365,
//     price: 999,
//     discountPercentage: 15,
//     discountCodes: [
//       { code: "YEARLY25", percentage: 25 }
//     ]
//   }
// ];

// // Seed function
// const seedDB = async () => {
//   try {
//     await mongoose.connect(MONGO_URI, {
//       useNewUrlParser: true,
//       useUnifiedTopology: true,
//     });
//     console.log("MongoDB connected");

//     // Optional: clear existing data
//     await SubscriptionPlan.deleteMany({});
//     console.log("Existing plans cleared");

//     // Insert seed plans
//     await SubscriptionPlan.insertMany(seedPlans);
//     console.log("Seed data inserted successfully");
//   } catch (err) {
//     console.error("Error seeding data:", err);
//   } finally {
//     // Close connection
//     await mongoose.connection.close();
//     console.log("MongoDB connection closed");
//     process.exit(0);
//   }
// };

// seedDB();



// import mongoose from "mongoose";
// import dotenv from "dotenv";
// import User from "./models/User.js"; // adjust path
// import SubscriptionPlan from "./models/SubscriptionPlan.js"; // adjust path

// dotenv.config();

// const MONGO_URI = process.env.MONGO_URI;

// if (!MONGO_URI) {
//   console.error("MONGO_URI not found in .env");
//   process.exit(1);
// }

// const updateUsers = async () => {
//   try {
//     await mongoose.connect(MONGO_URI, {
//       useNewUrlParser: true,
//       useUnifiedTopology: true,
//     });
//     console.log("MongoDB connected");

//     // Optional: pick a default subscription plan
//     const defaultPlan = await SubscriptionPlan.findOne({ name: "1 Month" });
    
//     if (!defaultPlan) {
//       console.warn("No default subscription plan found, subscription will be empty");
//     }

//     // Update all users that don't have subscription field
//     const result = await User.updateMany(
//       { subscription: { $exists: false } }, // only users missing subscription
//       {
//         $set: {
//           subscription: defaultPlan
//             ? {
//                 planId: defaultPlan._id,
//                 startDate: new Date(),
//                 endDate: new Date(Date.now() + defaultPlan.durationInDays * 24 * 60 * 60 * 1000),
//                 isActive: true,
//               }
//             : {
//                 planId: null,
//                 startDate: null,
//                 endDate: null,
//                 isActive: false,
//               },
//         },
//       }
//     );

//     console.log(`Updated ${result.modifiedCount} users with default subscription`);
//   } catch (err) {
//     console.error("Error updating users:", err);
//   } finally {
//     await mongoose.connection.close();
//     console.log("MongoDB connection closed");
//     process.exit(0);
//   }
// };

// updateUsers();




// import mongoose from "mongoose";
// import dotenv from "dotenv";
// import Quiz from "./models/Quiz.js";

// dotenv.config();
// const mongoURI = process.env.MONGO_URI;

// const reorderFieldsAndAddIsFree = async () => {
//   try {
//     await mongoose.connect(mongoURI);
//     console.log("✅ MongoDB connected");

//     // Find documents that do not have `isFree`
//     const quizzes = await Quiz.find({ isFree: { $exists: false } });

//     console.log(`🟡 Found ${quizzes.length} quizzes missing "isFree"`);

//     for (const quiz of quizzes) {
//       // Convert Mongoose document to plain object
//       const obj = quiz.toObject();

//       // Rebuild object with desired order: insert isFree right after isActive
//       const reordered = {};
//       for (const key of Object.keys(obj)) {
//         reordered[key] = obj[key];
//         if (key === "isActive") {
//           reordered["isFree"] = false; // add right after isActive
//         }
//       }

//       // Replace entire document with reordered one
//       await Quiz.replaceOne({ _id: quiz._id }, reordered);
//     }

//     console.log(`✅ Successfully updated ${quizzes.length} documents`);
//   } catch (err) {
//     console.error("❌ Error:", err);
//   } finally {
//     await mongoose.disconnect();
//     console.log("🔌 MongoDB disconnected");
//   }
// };

// reorderFieldsAndAddIsFree();





import mongoose from "mongoose";
import dotenv from "dotenv";

// Load environment variables from .env
dotenv.config();

const renameCollection = async () => {
  try {
    // Use URI from .env or fallback to localhost
    const mongoURI = process.env.MONGO_URI || "mongodb://localhost:27017/edu-puzzle";

    // Connect to the database
    const conn = await mongoose.connect(mongoURI);
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);

    // Rename the collection
    const oldName = "puzzle";
    const newName = "quizId";

    const db = conn.connection.db;

    // Check if 'puzzles' collection exists
    const collections = await db.listCollections({ name: oldName }).toArray();

    if (collections.length > 0) {
      await db.collection(oldName).rename(newName);
      console.log(`🎉 Collection renamed from '${oldName}' ➜ '${newName}'`);
    } else {
      console.log(`⚠️ Collection '${oldName}' does not exist, skipping rename.`);
    }

    await mongoose.disconnect();
    console.log("🔌 MongoDB disconnected.");
    process.exit(0);
  } catch (err) {
    console.error("❌ Error renaming collection:", err.message);
    process.exit(1);
  }
};

renameCollection();
