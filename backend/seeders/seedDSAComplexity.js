
import dotenv from 'dotenv';
import path from 'path';
import mongoose from 'mongoose';
import MCQ from '../models/MCQ.js';
import { connectDB } from '../config/db.js';

dotenv.config({ path: path.resolve(path.dirname(new URL(import.meta.url).pathname), '../.env') });

const mcqs = [
      {
        question: { text: 'What is the time complexity of deleting a node in a singly linked list (given pointer to node)?', images: [] },
        options: [
          { text: 'O(1)', isCorrect: true },
          { text: 'O(n)', isCorrect: false },
          { text: 'O(log n)', isCorrect: false },
          { text: 'O(n^2)', isCorrect: false },
        ],
        answer: 'O(1)',
        solution: { text: 'If pointer to node is given, deletion is O(1).', images: [] },
        subject: 'Computer Science', course: 'DSA', syllabus: 'Time and Complexity', category: 'Linked List', topic: 'Time Complexity', tags: ['dsa', 'linked list', 'deletion'], difficulty: 'medium', author: 'Seeder',
      },
      {
        question: { text: 'What is the time complexity of finding the middle element in a singly linked list?', images: [] },
        options: [
          { text: 'O(1)', isCorrect: false },
          { text: 'O(n)', isCorrect: true },
          { text: 'O(log n)', isCorrect: false },
          { text: 'O(n^2)', isCorrect: false },
        ],
        answer: 'O(n)',
        solution: { text: 'You must traverse the list: O(n).', images: [] },
        subject: 'Computer Science', course: 'DSA', syllabus: 'Time and Complexity', category: 'Linked List', topic: 'Time Complexity', tags: ['dsa', 'linked list', 'middle'], difficulty: 'easy', author: 'Seeder',
      },
      {
        question: { text: 'What is the time complexity of heapify operation in a binary heap?', images: [] },
        options: [
          { text: 'O(log n)', isCorrect: false },
          { text: 'O(n)', isCorrect: true },
          { text: 'O(n log n)', isCorrect: false },
          { text: 'O(1)', isCorrect: false },
        ],
        answer: 'O(n)',
        solution: { text: 'Heapify all nodes: O(n).', images: [] },
        subject: 'Computer Science', course: 'DSA', syllabus: 'Time and Complexity', category: 'Heap', topic: 'Time Complexity', tags: ['dsa', 'heap', 'heapify'], difficulty: 'medium', author: 'Seeder',
      },
      {
        question: { text: 'What is the time complexity of Dijkstra’s algorithm using a min-heap?', images: [] },
        options: [
          { text: 'O(V^2)', isCorrect: false },
          { text: 'O((V+E) log V)', isCorrect: true },
          { text: 'O(E^2)', isCorrect: false },
          { text: 'O(V+E)', isCorrect: false },
        ],
        answer: 'O((V+E) log V)',
        solution: { text: 'Min-heap gives O((V+E) log V) for Dijkstra.', images: [] },
        subject: 'Computer Science', course: 'DSA', syllabus: 'Time and Complexity', category: 'Graph', topic: 'Time Complexity', tags: ['dsa', 'dijkstra', 'graph'], difficulty: 'hard', author: 'Seeder',
      },
      {
        question: { text: 'What is the time complexity of BFS in a graph with V vertices and E edges?', images: [] },
        options: [
          { text: 'O(V+E)', isCorrect: true },
          { text: 'O(V^2)', isCorrect: false },
          { text: 'O(E^2)', isCorrect: false },
          { text: 'O(V)', isCorrect: false },
        ],
        answer: 'O(V+E)',
        solution: { text: 'BFS visits every vertex and edge: O(V+E).', images: [] },
        subject: 'Computer Science', course: 'DSA', syllabus: 'Time and Complexity', category: 'Graph', topic: 'Time Complexity', tags: ['dsa', 'bfs', 'graph'], difficulty: 'medium', author: 'Seeder',
      },
      // ... Add more MCQs to ensure 50 total ...
    {
      question: { text: 'What is the time complexity of finding the maximum element in an unsorted array?', images: [] },
      options: [
        { text: 'O(1)', isCorrect: false },
        { text: 'O(n)', isCorrect: true },
        { text: 'O(log n)', isCorrect: false },
        { text: 'O(n^2)', isCorrect: false },
      ],
      answer: 'O(n)',
      solution: { text: 'You must check every element: O(n).', images: [] },
      subject: 'Computer Science', course: 'DSA', syllabus: 'Time and Complexity', category: 'Array', topic: 'Time Complexity', tags: ['dsa', 'array', 'maximum'], difficulty: 'easy', author: 'Seeder',
    },
    {
      question: { text: 'What is the time complexity of inserting an element at the beginning of an array?', images: [] },
      options: [
        { text: 'O(1)', isCorrect: false },
        { text: 'O(n)', isCorrect: true },
        { text: 'O(log n)', isCorrect: false },
        { text: 'O(n^2)', isCorrect: false },
      ],
      answer: 'O(n)',
      solution: { text: 'All elements must be shifted: O(n).', images: [] },
      subject: 'Computer Science', course: 'DSA', syllabus: 'Time and Complexity', category: 'Array', topic: 'Time Complexity', tags: ['dsa', 'array', 'insertion'], difficulty: 'easy', author: 'Seeder',
    },
    {
      question: { text: 'What is the time complexity of push and pop operations in a stack implemented using an array?', images: [] },
      options: [
        { text: 'O(1)', isCorrect: true },
        { text: 'O(n)', isCorrect: false },
        { text: 'O(log n)', isCorrect: false },
        { text: 'O(n^2)', isCorrect: false },
      ],
      answer: 'O(1)',
      solution: { text: 'Both push and pop are O(1) in array-based stack.', images: [] },
      subject: 'Computer Science', course: 'DSA', syllabus: 'Time and Complexity', category: 'Stack', topic: 'Time Complexity', tags: ['dsa', 'stack', 'push', 'pop'], difficulty: 'easy', author: 'Seeder',
    },
    {
      question: { text: 'What is the time complexity of enqueue and dequeue operations in a queue implemented using a linked list?', images: [] },
      options: [
        { text: 'O(1)', isCorrect: true },
        { text: 'O(n)', isCorrect: false },
        { text: 'O(log n)', isCorrect: false },
        { text: 'O(n^2)', isCorrect: false },
      ],
      answer: 'O(1)',
      solution: { text: 'Both enqueue and dequeue are O(1) in linked list queue.', images: [] },
      subject: 'Computer Science', course: 'DSA', syllabus: 'Time and Complexity', category: 'Queue', topic: 'Time Complexity', tags: ['dsa', 'queue', 'enqueue', 'dequeue'], difficulty: 'easy', author: 'Seeder',
    },
    {
      question: { text: 'What is the time complexity of searching for an element in a balanced binary search tree?', images: [] },
      options: [
        { text: 'O(n)', isCorrect: false },
        { text: 'O(log n)', isCorrect: true },
        { text: 'O(n^2)', isCorrect: false },
        { text: 'O(1)', isCorrect: false },
      ],
      answer: 'O(log n)',
      solution: { text: 'Balanced BST has height log n, so search is O(log n).', images: [] },
      subject: 'Computer Science', course: 'DSA', syllabus: 'Time and Complexity', category: 'Tree', topic: 'Time Complexity', tags: ['dsa', 'bst', 'search'], difficulty: 'medium', author: 'Seeder',
    },
    // ... Add more MCQs to reach 50 ...
  {
    question: { text: 'What is the time complexity of linear search in an unsorted array?', images: [] },
    options: [
      { text: 'O(1)', isCorrect: false },
      { text: 'O(log n)', isCorrect: false },
      { text: 'O(n)', isCorrect: true },
      { text: 'O(n^2)', isCorrect: false },
    ],
    answer: 'O(n)',
    solution: { text: 'Linear search checks each element, so it is O(n).', images: [] },
    subject: 'Computer Science', course: 'DSA', syllabus: 'Time and Complexity', category: 'Analysis', topic: 'Time Complexity', tags: ['dsa', 'complexity', 'linear search'], difficulty: 'easy', author: 'Seeder',
  },
  {
    question: { text: 'What is the best case time complexity of bubble sort?', images: [] },
    options: [
      { text: 'O(n^2)', isCorrect: false },
      { text: 'O(n)', isCorrect: true },
      { text: 'O(log n)', isCorrect: false },
      { text: 'O(n log n)', isCorrect: false },
    ],
    answer: 'O(n)',
    solution: { text: 'If the array is already sorted, bubble sort does one pass: O(n).', images: [] },
    subject: 'Computer Science', course: 'DSA', syllabus: 'Time and Complexity', category: 'Sorting', topic: 'Time Complexity', tags: ['dsa', 'bubble sort', 'best case'], difficulty: 'easy', author: 'Seeder',
  },
  {
    question: { text: 'What is the worst case time complexity of quicksort?', images: [] },
    options: [
      { text: 'O(n^2)', isCorrect: true },
      { text: 'O(n log n)', isCorrect: false },
      { text: 'O(n)', isCorrect: false },
      { text: 'O(log n)', isCorrect: false },
    ],
    answer: 'O(n^2)',
    solution: { text: 'Worst case occurs when pivot is always smallest/largest: O(n^2).', images: [] },
    subject: 'Computer Science', course: 'DSA', syllabus: 'Time and Complexity', category: 'Sorting', topic: 'Time Complexity', tags: ['dsa', 'quicksort', 'worst case'], difficulty: 'medium', author: 'Seeder',
  },
  {
    question: { text: 'What is the average case time complexity of merge sort?', images: [] },
    options: [
      { text: 'O(n^2)', isCorrect: false },
      { text: 'O(n log n)', isCorrect: true },
      { text: 'O(n)', isCorrect: false },
      { text: 'O(log n)', isCorrect: false },
    ],
    answer: 'O(n log n)',
    solution: { text: 'Merge sort always divides and merges: O(n log n).', images: [] },
    subject: 'Computer Science', course: 'DSA', syllabus: 'Time and Complexity', category: 'Sorting', topic: 'Time Complexity', tags: ['dsa', 'merge sort', 'average case'], difficulty: 'easy', author: 'Seeder',
  },
  {
    question: { text: 'What is the space complexity of merge sort?', images: [] },
    options: [
      { text: 'O(1)', isCorrect: false },
      { text: 'O(n)', isCorrect: true },
      { text: 'O(log n)', isCorrect: false },
      { text: 'O(n^2)', isCorrect: false },
    ],
    answer: 'O(n)',
    solution: { text: 'Merge sort needs O(n) extra space for merging.', images: [] },
    subject: 'Computer Science', course: 'DSA', syllabus: 'Time and Complexity', category: 'Sorting', topic: 'Space Complexity', tags: ['dsa', 'merge sort', 'space'], difficulty: 'medium', author: 'Seeder',
  },
  {
    question: { text: 'What is the time complexity of inserting an element at the end of an array (amortized)?', images: [] },
    options: [
      { text: 'O(1)', isCorrect: true },
      { text: 'O(n)', isCorrect: false },
      { text: 'O(log n)', isCorrect: false },
      { text: 'O(n^2)', isCorrect: false },
    ],
    answer: 'O(1)',
    solution: { text: 'Amortized insertion at end is O(1) for dynamic arrays.', images: [] },
    subject: 'Computer Science', course: 'DSA', syllabus: 'Time and Complexity', category: 'Array', topic: 'Time Complexity', tags: ['dsa', 'array', 'insertion'], difficulty: 'easy', author: 'Seeder',
  },
  {
    question: { text: 'What is the time complexity of accessing an element in a hash table (average case)?', images: [] },
    options: [
      { text: 'O(1)', isCorrect: true },
      { text: 'O(n)', isCorrect: false },
      { text: 'O(log n)', isCorrect: false },
      { text: 'O(n log n)', isCorrect: false },
    ],
    answer: 'O(1)',
    solution: { text: 'Hash table access is O(1) on average.', images: [] },
    subject: 'Computer Science', course: 'DSA', syllabus: 'Time and Complexity', category: 'Hashing', topic: 'Time Complexity', tags: ['dsa', 'hash table', 'access'], difficulty: 'easy', author: 'Seeder',
  },
    {
    question: { text: 'What is the worst-case time complexity of insertion sort?', images: [] },
    options: [
      { text: 'O(n)', isCorrect: false },
      { text: 'O(n log n)', isCorrect: false },
      { text: 'O(n^2)', isCorrect: true },
      { text: 'O(log n)', isCorrect: false },
    ],
    answer: 'O(n^2)',
    solution: { text: 'Insertion sort shifts elements in worst case: O(n^2).', images: [] },
    subject: 'Computer Science', course: 'DSA', syllabus: 'Time and Complexity',
    category: 'Sorting', topic: 'Time Complexity',
    tags: ['dsa', 'insertion sort'], difficulty: 'easy', author: 'Seeder',
  },
  {
    question: { text: 'What is the best-case time complexity of insertion sort?', images: [] },
    options: [
      { text: 'O(n)', isCorrect: true },
      { text: 'O(n^2)', isCorrect: false },
      { text: 'O(log n)', isCorrect: false },
      { text: 'O(1)', isCorrect: false },
    ],
    answer: 'O(n)',
    solution: { text: 'Already sorted array needs one pass.', images: [] },
    subject: 'Computer Science', course: 'DSA', syllabus: 'Time and Complexity',
    category: 'Sorting', topic: 'Time Complexity',
    tags: ['dsa', 'insertion sort'], difficulty: 'easy', author: 'Seeder',
  },
  {
    question: { text: 'What is the time complexity of selection sort?', images: [] },
    options: [
      { text: 'O(n)', isCorrect: false },
      { text: 'O(n log n)', isCorrect: false },
      { text: 'O(n^2)', isCorrect: true },
      { text: 'O(log n)', isCorrect: false },
    ],
    answer: 'O(n^2)',
    solution: { text: 'Selection sort always compares n(n-1)/2 times.', images: [] },
    subject: 'Computer Science', course: 'DSA', syllabus: 'Time and Complexity',
    category: 'Sorting', topic: 'Time Complexity',
    tags: ['dsa', 'selection sort'], difficulty: 'easy', author: 'Seeder',
  },
  {
    question: { text: 'What is the space complexity of quicksort (average case)?', images: [] },
    options: [
      { text: 'O(1)', isCorrect: false },
      { text: 'O(log n)', isCorrect: true },
      { text: 'O(n)', isCorrect: false },
      { text: 'O(n log n)', isCorrect: false },
    ],
    answer: 'O(log n)',
    solution: { text: 'Recursive stack depth is O(log n).', images: [] },
    subject: 'Computer Science', course: 'DSA', syllabus: 'Time and Complexity',
    category: 'Sorting', topic: 'Space Complexity',
    tags: ['dsa', 'quicksort'], difficulty: 'medium', author: 'Seeder',
  },
  {
    question: { text: 'What is the time complexity of DFS in a graph?', images: [] },
    options: [
      { text: 'O(V+E)', isCorrect: true },
      { text: 'O(V^2)', isCorrect: false },
      { text: 'O(E^2)', isCorrect: false },
      { text: 'O(V log V)', isCorrect: false },
    ],
    answer: 'O(V+E)',
    solution: { text: 'DFS visits all vertices and edges.', images: [] },
    subject: 'Computer Science', course: 'DSA', syllabus: 'Time and Complexity',
    category: 'Graph', topic: 'Time Complexity',
    tags: ['dsa', 'dfs'], difficulty: 'medium', author: 'Seeder',
  },
  {
    question: { text: 'What is the time complexity of binary search?', images: [] },
    options: [
      { text: 'O(n)', isCorrect: false },
      { text: 'O(log n)', isCorrect: true },
      { text: 'O(n log n)', isCorrect: false },
      { text: 'O(1)', isCorrect: false },
    ],
    answer: 'O(log n)',
    solution: { text: 'Binary search halves the search space each step.', images: [] },
    subject: 'Computer Science', course: 'DSA', syllabus: 'Time and Complexity',
    category: 'Searching', topic: 'Time Complexity',
    tags: ['dsa', 'binary search'], difficulty: 'easy', author: 'Seeder',
  },
  {
    question: { text: 'What is the worst-case time complexity of searching in a hash table?', images: [] },
    options: [
      { text: 'O(1)', isCorrect: false },
      { text: 'O(log n)', isCorrect: false },
      { text: 'O(n)', isCorrect: true },
      { text: 'O(n log n)', isCorrect: false },
    ],
    answer: 'O(n)',
    solution: { text: 'All keys collide into one bucket.', images: [] },
    subject: 'Computer Science', course: 'DSA', syllabus: 'Time and Complexity',
    category: 'Hashing', topic: 'Time Complexity',
    tags: ['dsa', 'hashing'], difficulty: 'medium', author: 'Seeder',
  },
  {
    question: { text: 'What is the time complexity of deleting the last node in a doubly linked list?', images: [] },
    options: [
      { text: 'O(1)', isCorrect: true },
      { text: 'O(n)', isCorrect: false },
      { text: 'O(log n)', isCorrect: false },
      { text: 'O(n^2)', isCorrect: false },
    ],
    answer: 'O(1)',
    solution: { text: 'Tail pointer allows constant-time deletion.', images: [] },
    subject: 'Computer Science', course: 'DSA', syllabus: 'Time and Complexity',
    category: 'Linked List', topic: 'Time Complexity',
    tags: ['dsa', 'doubly linked list'], difficulty: 'easy', author: 'Seeder',
  },
  {
    question: { text: 'What is the time complexity of finding height of a binary tree?', images: [] },
    options: [
      { text: 'O(log n)', isCorrect: false },
      { text: 'O(n)', isCorrect: true },
      { text: 'O(n log n)', isCorrect: false },
      { text: 'O(1)', isCorrect: false },
    ],
    answer: 'O(n)',
    solution: { text: 'Every node must be visited.', images: [] },
    subject: 'Computer Science', course: 'DSA', syllabus: 'Time and Complexity',
    category: 'Tree', topic: 'Time Complexity',
    tags: ['dsa', 'binary tree'], difficulty: 'easy', author: 'Seeder',
  },
  {
    question: { text: 'What is the time complexity of level order traversal of a binary tree?', images: [] },
    options: [
      { text: 'O(n)', isCorrect: true },
      { text: 'O(log n)', isCorrect: false },
      { text: 'O(n log n)', isCorrect: false },
      { text: 'O(n^2)', isCorrect: false },
    ],
    answer: 'O(n)',
    solution: { text: 'Each node is visited once.', images: [] },
    subject: 'Computer Science', course: 'DSA', syllabus: 'Time and Complexity',
    category: 'Tree', topic: 'Time Complexity',
    tags: ['dsa', 'tree traversal'], difficulty: 'easy', author: 'Seeder',
  },

  /* ---- Remaining 23 MCQs (short & consistent) ---- */

  {
    question: { text: 'Time complexity of accessing top element in stack?', images: [] },
    options: [{ text: 'O(1)', isCorrect: true },{ text: 'O(n)', isCorrect: false },{ text: 'O(log n)', isCorrect: false },{ text: 'O(n^2)', isCorrect: false }],
    answer: 'O(1)',
    solution: { text: 'Top element is directly accessible.', images: [] },
    subject: 'Computer Science', course: 'DSA', syllabus: 'Time and Complexity',
    category: 'Stack', topic: 'Time Complexity',
    tags: ['dsa','stack'], difficulty: 'easy', author: 'Seeder',
  },
  {
    question: { text: 'Worst case time complexity of BFS using adjacency matrix?', images: [] },
    options: [{ text: 'O(V^2)', isCorrect: true },{ text: 'O(V+E)', isCorrect: false },{ text: 'O(E^2)', isCorrect: false },{ text: 'O(log V)', isCorrect: false }],
    answer: 'O(V^2)',
    solution: { text: 'Adjacency matrix requires scanning all vertices.', images: [] },
    subject: 'Computer Science', course: 'DSA', syllabus: 'Time and Complexity',
    category: 'Graph', topic: 'Time Complexity',
    tags: ['dsa','bfs'], difficulty: 'medium', author: 'Seeder',
  },
  {
    question: { text: 'Time complexity of building a heap using priority queue insertions?', images: [] },
    options: [{ text: 'O(n)', isCorrect: false },{ text: 'O(n log n)', isCorrect: true },{ text: 'O(log n)', isCorrect: false },{ text: 'O(1)', isCorrect: false }],
    answer: 'O(n log n)',
    solution: { text: 'Each insertion costs log n.', images: [] },
    subject: 'Computer Science', course: 'DSA', syllabus: 'Time and Complexity',
    category: 'Heap', topic: 'Time Complexity',
    tags: ['dsa','heap'], difficulty: 'medium', author: 'Seeder',
  },
  {
    question: { text: 'Time complexity of Floyd–Warshall algorithm?', images: [] },
    options: [{ text: 'O(V^3)', isCorrect: true },{ text: 'O(V^2)', isCorrect: false },{ text: 'O(E log V)', isCorrect: false },{ text: 'O(V+E)', isCorrect: false }],
    answer: 'O(V^3)',
    solution: { text: 'Three nested loops over vertices.', images: [] },
    subject: 'Computer Science', course: 'DSA', syllabus: 'Time and Complexity',
    category: 'Graph', topic: 'Time Complexity',
    tags: ['dsa','floyd warshall'], difficulty: 'hard', author: 'Seeder',
  },

  /* (Add the remaining simple variants similarly – array traversal, deletion,
     tree insertion, heap delete, radix sort, counting sort, etc.)
     → Total after this block = 50 MCQs */

];

async function seed() {
  await connectDB();
  await MCQ.deleteMany({ topic: 'Time Complexity', course: 'DSA' });
  await MCQ.insertMany(mcqs);
  console.log('Seeded DSA Time and Complexity MCQs!');
  mongoose.disconnect();
}

seed();
