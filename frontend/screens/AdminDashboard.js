// import React, { useEffect, useState } from 'react';
// import {
//   View,
//   TextInput,
//   Button,
//   ScrollView,
//   Text,
//   Alert,
//   TouchableOpacity,
//   StyleSheet,
//   KeyboardAvoidingView,
//   Platform
// } from 'react-native';
// import axios from 'axios';

// export default function CreateHomeScreen() {
//   const [puzzleName, setPuzzleName] = useState('');
//   const [levels, setLevels] = useState([
//     { name: 'Easy', timeLimit: '', passingMarks: '', maxMarks: '', questions: [], open: false },
//     { name: 'Medium', timeLimit: '', passingMarks: '', maxMarks: '', questions: [], open: false },
//     { name: 'Hard', timeLimit: '', passingMarks: '', maxMarks: '', questions: [], open: false }
//   ]);

//   const [createdPuzzles, setCreatedPuzzles] = useState([]);
//   const [selectedPuzzleId, setSelectedPuzzleId] = useState(null);
//   const [selectedLevelName, setSelectedLevelName] = useState('');
//   const [newQuestion, setNewQuestion] = useState('');
//   const [newOptions, setNewOptions] = useState(['', '', '', '']);
//   const [newAnswer, setNewAnswer] = useState('');
//   const [hint, setHint] = useState('');
//   const [explanation, setExplanation] = useState('');
//   const [points, setPoints] = useState('');

//   useEffect(() => {
//     fetchCreatedPuzzles();
//   }, []);

//   const fetchCreatedPuzzles = async () => {
//     try {
//       const res = await axios.get('http://10.124.194.56:3000/api/puzzles');
//       setCreatedPuzzles(res.data);
//     } catch (err) {
//       console.error(err);
//     }
//   };

//   const toggleLevelInputs = (index) => {
//     const updated = [...levels];
//     updated[index].open = !updated[index].open;
//     setLevels(updated);
//   };

//   const updateLevel = (index, field, value) => {
//     const updated = [...levels];
//     updated[index][field] = value;
//     setLevels(updated);
//   };

//   const createPuzzle = async () => {
//     try {
//       const sanitizedLevels = levels.map(lvl => ({
//         name: lvl.name,
//         timeLimit: parseInt(lvl.timeLimit),
//         passingMarks: parseInt(lvl.passingMarks),
//         maxMarks: parseInt(lvl.maxMarks),
//         questions: []
//       }));

//       const payload = {
//         name: puzzleName,
//         numberOfLevels: 3,
//         levels: sanitizedLevels,
//         author: "Admin"
//       };

//       await axios.post('http://10.124.194.56:3000/api/puzzles/create', payload);
//       Alert.alert('Success', 'Puzzle created!');
//       setPuzzleName('');
//       fetchCreatedPuzzles();
//     } catch (err) {
//       console.error(err);
//       Alert.alert('Error', err.response?.data?.message || 'Could not create puzzle');
//     }
//   };

//   const addQuestionToPuzzle = async () => {
//     if (!selectedPuzzleId || !selectedLevelName || !newQuestion || !newAnswer || newOptions.includes('')) {
//       return Alert.alert('Fill all question fields');
//     }

//     try {
//       const payload = {
//         question: newQuestion,
//         options: newOptions,
//         answer: newAnswer,
//         hint,
//         explanation,
//         points: parseInt(points)
//       };

//       await axios.post(`http://10.124.194.56:3000/api/puzzles/${selectedPuzzleId}/levels/${selectedLevelName}/add-question`, payload);
//       Alert.alert('Success', 'Question added');
//       setNewQuestion('');
//       setNewOptions(['', '', '', '']);
//       setNewAnswer('');
//       setHint('');
//       setExplanation('');
//       setPoints('');
//       fetchCreatedPuzzles();
//     } catch (err) {
//       console.error(err);
//       Alert.alert('Error', err.response?.data?.message || 'Failed to add question');
//     }
//   };

//   return (
    
      
//       <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
//         <Text style={styles.title}>Create New Puzzle</Text>

//         <Text style={styles.label}>Puzzle Name</Text>
//         <TextInput
//           value={puzzleName}
//           onChangeText={setPuzzleName}
//           placeholder="Enter puzzle name"
//           style={styles.input}
//         />

//         {levels.map((lvl, index) => (
//           <View key={index} style={styles.levelBlock}>
//             <TouchableOpacity onPress={() => toggleLevelInputs(index)}>
//               <Text style={styles.toggleHeader}>{lvl.name} Level {lvl.open ? '🔽' : '▶️'}</Text>
//             </TouchableOpacity>
//             {lvl.open && (
//               <>
//                 <TextInput
//                   placeholder="Time Limit (seconds)"
//                   keyboardType="numeric"
//                   value={lvl.timeLimit}
//                   onChangeText={(val) => updateLevel(index, 'timeLimit', val)}
//                   style={styles.input}
//                 />
//                 <TextInput
//                   placeholder="Max Marks"
//                   keyboardType="numeric"
//                   value={lvl.maxMarks}
//                   onChangeText={(val) => updateLevel(index, 'maxMarks', val)}
//                   style={styles.input}
//                 />
//                 <TextInput
//                   placeholder="Passing Marks"
//                   keyboardType="numeric"
//                   value={lvl.passingMarks}
//                   onChangeText={(val) => updateLevel(index, 'passingMarks', val)}
//                   style={styles.input}
//                 />
//               </>
//             )}
//           </View>
//         ))}

//         <Button title="🚀 Create Puzzle" onPress={createPuzzle} />

//         <Text style={styles.sectionTitle}>Created Puzzles</Text>
//         {createdPuzzles.map((puzzle) => (
//           <View key={puzzle._id} style={styles.puzzleCard}>
//             <Text style={styles.puzzleTitle}>{puzzle.name}</Text>
//             {puzzle.levels.map((lvl, idx) => (
//               <TouchableOpacity
//                 key={idx}
//                 onPress={() => {
//                   setSelectedPuzzleId(puzzle._id);
//                   setSelectedLevelName(lvl.name);
//                 }}
//               >
//                 <Text style={styles.levelLink}>🔹 {lvl.name} (Questions: {lvl.questions.length})</Text>
//               </TouchableOpacity>
//             ))}
//           </View>
//         ))}

//         {selectedPuzzleId && (
//           <View style={styles.addQuestionBlock}>
//             <Text style={styles.subtitle}>Add Question to: {selectedLevelName}</Text>
//             <TextInput placeholder="Question" value={newQuestion} onChangeText={setNewQuestion} style={styles.input} />
//             {newOptions.map((opt, idx) => (
//               <TextInput
//                 key={idx}
//                 placeholder={`Option ${idx + 1}`}
//                 value={opt}
//                 onChangeText={(val) => {
//                   const updated = [...newOptions];
//                   updated[idx] = val;
//                   setNewOptions(updated);
//                 }}
//                 style={styles.input}
//               />
//             ))}
//             <TextInput placeholder="Correct Answer" value={newAnswer} onChangeText={setNewAnswer} style={styles.input} />
//             <TextInput placeholder="Hint (optional)" value={hint} onChangeText={setHint} style={styles.input} />
//             <TextInput placeholder="Explanation (optional)" value={explanation} onChangeText={setExplanation} style={styles.input} />
//             <TextInput placeholder="Points (e.g. 5)" value={points} keyboardType="numeric" onChangeText={setPoints} style={styles.input} />
//             <Button title="✅ Add Question" onPress={addQuestionToPuzzle} />
//           </View>
//         )}
//       </ScrollView>

//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     padding: 29,
//     paddingBottom: 40,
//     height: '200%',
//   },
//   title: {
//     fontWeight: 'bold',
//     fontSize: 22,
//     marginBottom: 15
//   },
//   label: {
//     fontWeight: '600',
//     marginBottom: 5
//   },
//   input: {
//     borderWidth: 1,
//     borderColor: '#ccc',
//     padding: 10,
//     marginBottom: 12,
//     borderRadius: 5
//   },
//   levelBlock: {
//     marginBottom: 20,
//     borderBottomWidth: 1,
//     borderColor: '#eee',
//     paddingBottom: 10
//   },
//   toggleHeader: {
//     fontSize: 16,
//     fontWeight: 'bold',
//     color: '#007bff',
//     marginBottom: 5
//   },
//   sectionTitle: {
//     fontSize: 18,
//     fontWeight: 'bold',
//     marginVertical: 20
//   },
//   puzzleCard: {
//     borderWidth: 1,
//     padding: 10,
//     borderRadius: 5,
//     marginBottom: 15
//   },
//   puzzleTitle: {
//     fontWeight: 'bold',
//     fontSize: 16
//   },
//   levelLink: {
//     color: '#007bff',
//     marginTop: 5
//   },
//   addQuestionBlock: {
//     marginTop: 30
//   },
//   subtitle: {
//     fontWeight: 'bold',
//     fontSize: 16,
//     marginBottom: 10
//   }
// });






// import React, { useEffect, useState } from 'react';
// import {
//   View,
//   Modal,
//   TextInput,
//   Button,
//   ScrollView,
//   Text,
//   Alert,
//   TouchableOpacity,
//   StyleSheet,
//    Dimensions, Platform,
// } from 'react-native';
// import { Picker } from '@react-native-picker/picker';
// import axios from 'axios';
// const { width } = Dimensions.get('window');

// export default function CreateHomeScreen() {
//   const [puzzleName, setPuzzleName] = useState('');
//   const [levels, setLevels] = useState([
//     { name: 'Easy', timeLimit: '', passingMarks: '', maxMarks: '', questions: [] },
//     { name: 'Medium', timeLimit: '', passingMarks: '', maxMarks: '', questions: [] },
//     { name: 'Hard', timeLimit: '', passingMarks: '', maxMarks: '', questions: [] }
//   ]);
//   const [selectedLevelName, setSelectedLevelName] = useState('');

//   const [createdPuzzles, setCreatedPuzzles] = useState([]);
//   const [selectedPuzzleId, setSelectedPuzzleId] = useState(null);
//   const [newQuestion, setNewQuestion] = useState('');
//   const [newOptions, setNewOptions] = useState(['', '', '', '']);
//   const [newAnswer, setNewAnswer] = useState('');
//   const [hint, setHint] = useState('');
//   const [explanation, setExplanation] = useState('');
//   const [points, setPoints] = useState('');
//   const [isVisible, setIsVisible] = useState(false); 

//   useEffect(() => {
//     fetchCreatedPuzzles();
//   }, []);

//   const fetchCreatedPuzzles = async () => {
//     try {
//       const res = await axios.get('http://10.124.194.56:3000/api/puzzles');
//       setCreatedPuzzles(res.data);
//     } catch (err) {
//       console.error(err);
//     }
//   };

//   const updateLevel = (index, field, value) => {
//     const updated = [...levels];
//     updated[index][field] = value;
//     setLevels(updated);
//   };

//   const createPuzzle = async () => {
//     try {
//       const sanitizedLevels = levels.map(lvl => ({
//         name: lvl.name,
//         timeLimit: parseInt(lvl.timeLimit),
//         passingMarks: parseInt(lvl.passingMarks),
//         maxMarks: parseInt(lvl.maxMarks),
//         questions: []
//       }));

//       const payload = {
//         name: puzzleName,
//         numberOfLevels: 3,
//         levels: sanitizedLevels,
//         author: "Admin"
//       };

//       await axios.post('http://10.124.194.56:3000/api/puzzles/create', payload);
//       Alert.alert('Success', 'Puzzle created!');
//       setPuzzleName('');
//       setSelectedLevelName('');
//       fetchCreatedPuzzles();
//     } catch (err) {
//       console.error(err);
//       Alert.alert('Error', err.response?.data?.message || 'Could not create puzzle');
//     }
//   };

//   const addQuestionToPuzzle = async () => {
//     if (!selectedPuzzleId || !selectedLevelName || !newQuestion || !newAnswer || newOptions.includes('')) {
//       return Alert.alert('Fill all question fields');
//     }

//     try {
//       const payload = {
//         question: newQuestion,
//         options: newOptions,
//         answer: newAnswer,
//         hint,
//         explanation,
//         points: parseInt(points)
//       };

//       await axios.post(`http://10.124.194.56:3000/api/puzzles/${selectedPuzzleId}/levels/${selectedLevelName}/add-question`, payload);
//       Alert.alert('Success', 'Question added');
//       setNewQuestion('');
//       setNewOptions(['', '', '', '']);
//       setNewAnswer('');
//       setHint('');
//       setExplanation('');
//       setPoints('');
//       fetchCreatedPuzzles();
//     } catch (err) {
//       console.error(err);
//       Alert.alert('Error', err.response?.data?.message || 'Failed to add question');
//     }
//   };

//   return (
//     <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
//       <Text style={styles.title}>Create New Puzzle</Text>

//       <Text style={styles.label}>Puzzle Name</Text>
//       <TextInput
//         value={puzzleName}
//         onChangeText={setPuzzleName}
//         placeholder="Enter puzzle name"
//         style={styles.input}
//       />

//       <Text style={styles.label}>Select Level to Configure</Text>
//       <Picker
//         selectedValue={selectedLevelName}
//         onValueChange={(value) => setSelectedLevelName(value)}
//         style={styles.input}
//       >
//         <Picker.Item label="-- Select Level --" value="" />
//         {levels.map((lvl, idx) => (
//           <Picker.Item key={idx} label={lvl.name} value={lvl.name} />
//         ))}
//       </Picker>

//       {selectedLevelName !== '' && (() => {
//         const index = levels.findIndex(lvl => lvl.name === selectedLevelName);
//         return (
//           <>
//             <Text style={styles.subtitle}>Configuring: {selectedLevelName}</Text>
//             <TextInput
//               placeholder="Time Limit (seconds)"
//               keyboardType="numeric"
//               value={levels[index].timeLimit}
//               onChangeText={(val) => updateLevel(index, 'timeLimit', val)}
//               style={styles.input}
//             />
//             <TextInput
//               placeholder="Max Marks"
//               keyboardType="numeric"
//               value={levels[index].maxMarks}
//               onChangeText={(val) => updateLevel(index, 'maxMarks', val)}
//               style={styles.input}
//             />
//             <TextInput
//               placeholder="Passing Marks"
//               keyboardType="numeric"
//               value={levels[index].passingMarks}
//               onChangeText={(val) => updateLevel(index, 'passingMarks', val)}
//               style={styles.input}
//             />
//           </>
//         );
//       })()}

//       <Button title="🚀 Create Puzzle" onPress={createPuzzle} />

//       <Text style={styles.sectionTitle}>Created Puzzles</Text>
//       {createdPuzzles.map((puzzle) => (
//         <View key={puzzle._id} style={styles.puzzleCard}>
//           <Text style={styles.puzzleTitle}>{puzzle.name}</Text>
//           <Button
//             title="Select Puzzle"
//             onPress={() => {
//               setSelectedPuzzleId(puzzle._id);
//               setSelectedLevelName('');
//             }}
//           />
//         </View>
//       ))}


    
 

//       {selectedPuzzleId && (
//   <Modal visible={isVisible} animationType="slide" transparent={true} onRequestClose={() => setIsVisible(false)}>
//   <View style={styles.modalOverlay}>
//         <View style={styles.addQuestionBlock}>
//           <Text style={styles.subtitle}>Select Level to Add Question</Text>
//           <Picker
//             selectedValue={selectedLevelName}
//             onValueChange={(itemValue) => setSelectedLevelName(itemValue)}
//             style={styles.input}
//           >
//             <Picker.Item label="-- Select Level --" value="" />
//             {createdPuzzles.find(p => p._id === selectedPuzzleId)?.levels.map((lvl, index) => (
//               <Picker.Item key={index} label={lvl.name} value={lvl.name} />
//             ))}
//           </Picker>

//           <Text style={styles.subtitle}>Add Question to: {selectedLevelName}</Text>
//           <TextInput placeholder="Question" value={newQuestion} onChangeText={setNewQuestion} style={styles.input} />
//           {newOptions.map((opt, idx) => (
//             <TextInput
//               key={idx}
//               placeholder={`Option ${idx + 1}`}
//               value={opt}
//               onChangeText={(val) => {
//                 const updated = [...newOptions];
//                 updated[idx] = val;
//                 setNewOptions(updated);
//               }}
//               style={styles.input}
//             />
//           ))}
//           <TextInput placeholder="Correct Answer" value={newAnswer} onChangeText={setNewAnswer} style={styles.input} />
//           <TextInput placeholder="Hint (optional)" value={hint} onChangeText={setHint} style={styles.input} />
//           <TextInput placeholder="Explanation (optional)" value={explanation} onChangeText={setExplanation} style={styles.input} />
//           <TextInput placeholder="Points (e.g. 5)" value={points} keyboardType="numeric" onChangeText={setPoints} style={styles.input} />
//           <Button title="✅ Add Question" onPress={addQuestionToPuzzle} />
//         </View></View>
// </Modal>
//       )}



//     </ScrollView>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     padding: 129,
//     paddingBottom: 40,
//     height: '200%',
//     width: '70%',
//     backgroundColor: '#146dc5ff'

//   },

//   title: {
//     fontWeight: '800',
//     fontSize: width > 600 ? 32 : 24,
//     marginBottom: 20,
//     color: '#2c3e50',
//     textAlign: 'center'
//   },
//   label: {
//     fontWeight: '600',
//     marginBottom: 6,
//     fontSize: 16,
//     color: '#34495e'
//   },
//   input: {
//     borderWidth: 1,
//     borderColor: '#ced6e0',
//     backgroundColor: 'rgba(255, 255, 255, 0.6)',
//     padding: 12,
//     fontSize: 16,
//     marginBottom: 16,
//     borderRadius: 12,
//     shadowColor: '#000',
//     shadowOpacity: 0.08,
//     shadowOffset: { width: 0, height: 2 },
//     shadowRadius: 6,
//     elevation: 3
//   },
//   sectionTitle: {
//     fontSize: 20,
//     fontWeight: '700',
//     marginVertical: 25,
//     color: '#2c3e50',
//     borderBottomWidth: 2,
//     borderColor: '#dfe4ea',
//     paddingBottom: 6
//   },
//   puzzleCard: {
//     borderWidth: 1,
//     borderColor: '#ecf0f1',
//     backgroundColor: 'rgba(255, 255, 255, 0.7)',
//     padding: 15,
//     borderRadius: 14,
//     marginBottom: 18,
//     shadowColor: '#000',
//     shadowOpacity: 0.1,
//     shadowOffset: { width: 0, height: 2 },
//     shadowRadius: 5,
//     elevation: 4
//   },
//   puzzleTitle: {
//     fontWeight: '700',
//     fontSize: 18,
//     color: '#34495e',
//     marginBottom: 8
//   },
//     modalOverlay: {
//     flex: 1,
//     backgroundColor: 'rgba(0,0,0,0.3)',
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   addQuestionBlock: {
//     width: '90%',
//     backgroundColor: 'rgba(255, 255, 255, 0.95)',
//     padding: 20,
//     borderRadius: 14,
//     shadowColor: '#000',
//     shadowOpacity: 0.1,
//     shadowOffset: { width: 0, height: 2 },
//     shadowRadius: 10,
//     elevation: 5,
//   },
//   // addQuestionBlock: {
//   //   marginTop: 40,
//   //   backgroundColor: 'rgba(255, 255, 255, 0.75)',
//   //   padding: 20,
//   //   borderRadius: 14,
//   //   shadowColor: '#000',
//   //   shadowOpacity: 0.07,
//   //   shadowOffset: { width: 0, height: 2 },
//   //   shadowRadius: 5,
//   //   elevation: 2
//   // },
//   subtitle: {
//     fontWeight: '700',
//     fontSize: 18,
//     marginBottom: 15,
//     color: '#2c3e50'
//   },
//   button: {
//     backgroundColor: '#6c5ce7',
//     padding: 14,
//     borderRadius: 10,
//     alignItems: 'center',
//     marginVertical: 10
//   },

// });




import React, { useEffect, useState } from 'react';
import {
  View,
  Modal,
  TextInput,
  ScrollView,
  Text,
  Alert,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  Platform
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import axios from 'axios';

const { width } = Dimensions.get('window');

export default function CreateHomeScreen() {
  const [puzzleName, setPuzzleName] = useState('');
  const [levels, setLevels] = useState([
    { name: 'Easy', timeLimit: '', passingMarks: '', maxMarks: '', questions: [] },
    { name: 'Medium', timeLimit: '', passingMarks: '', maxMarks: '', questions: [] },
    { name: 'Hard', timeLimit: '', passingMarks: '', maxMarks: '', questions: [] }
  ]);
  const [selectedLevelName, setSelectedLevelName] = useState('');
  const [createdPuzzles, setCreatedPuzzles] = useState([]);
  const [selectedPuzzleId, setSelectedPuzzleId] = useState(null);
  const [newQuestion, setNewQuestion] = useState('');
  const [newOptions, setNewOptions] = useState(['', '', '', '']);
  const [newAnswer, setNewAnswer] = useState('');
  const [hint, setHint] = useState('');
  const [explanation, setExplanation] = useState('');
  const [points, setPoints] = useState('');
  const [isVisible, setIsVisible] = useState(false);
  const [isLevelModalVisible, setIsLevelModalVisible] = useState(false);

  useEffect(() => {
    fetchCreatedPuzzles();
  }, []);

  const fetchCreatedPuzzles = async () => {
    try {
      const res = await axios.get('http://10.124.194.56:3000/api/puzzles');
      setCreatedPuzzles(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const updateLevel = (index, field, value) => {
    const updated = [...levels];
    updated[index][field] = value;
    setLevels(updated);
  };

  const createPuzzle = async () => {
    try {
      const sanitizedLevels = levels.map(lvl => ({
        name: lvl.name,
        timeLimit: parseInt(lvl.timeLimit),
        passingMarks: parseInt(lvl.passingMarks),
        maxMarks: parseInt(lvl.maxMarks),
        questions: []
      }));

      const payload = {
        name: puzzleName,
        numberOfLevels: 3,
        levels: sanitizedLevels,
        author: "Admin"
      };

      await axios.post('http://10.124.194.56:3000/api/puzzles/create', payload);
      Alert.alert('Success', 'Puzzle created!');
      setPuzzleName('');
      setSelectedLevelName('');
      fetchCreatedPuzzles();
    } catch (err) {
      console.error(err);
      Alert.alert('Error', err.response?.data?.message || 'Could not create puzzle');
    }
  };

  const addQuestionToPuzzle = async () => {
    if (!selectedPuzzleId || !selectedLevelName || !newQuestion || !newAnswer || newOptions.includes('')) {
      return Alert.alert('Fill all question fields');
    }

    try {
      const payload = {
        question: newQuestion,
        options: newOptions,
        answer: newAnswer,
        hint,
        explanation,
        points: parseInt(points)
      };

      await axios.post(`http://10.124.194.56:3000/api/puzzles/${selectedPuzzleId}/levels/${selectedLevelName}/add-question`, payload);
      Alert.alert('Success', 'Question added');
      setNewQuestion('');
      setNewOptions(['', '', '', '']);
      setNewAnswer('');
      setHint('');
      setExplanation('');
      setPoints('');
      setIsVisible(false);
      fetchCreatedPuzzles();
    } catch (err) {
      console.error(err);
      Alert.alert('Error', err.response?.data?.message || 'Failed to add question');
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
      <Text style={styles.title}>Create New Puzzle</Text>

      <Text style={styles.label}>Puzzle Name</Text>
      <TextInput value={puzzleName} onChangeText={setPuzzleName} placeholder="Enter puzzle name" style={styles.input} />

      <Text style={styles.subtitle}>Configure Levels</Text>
      <View style={styles.levelGrid}>
        {levels.map((level, index) => (
          <TouchableOpacity
            key={index}
            style={styles.levelCard}
            onPress={() => {
              setSelectedLevelName(level.name);
              setIsLevelModalVisible(true);
            }}
          >
            <Text style={styles.levelTitle}>{level.name}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <TouchableOpacity style={styles.button} onPress={createPuzzle}>
        <Text style={styles.buttonText}>Create Puzzle</Text>
      </TouchableOpacity>

      <Text style={styles.sectionTitle}>Created Puzzles</Text>
      <View style={styles.gridContainer}>
        {createdPuzzles.map((puzzle) => (
          <View key={puzzle._id} style={styles.puzzleCard}>
            <Text style={styles.puzzleTitle}>{puzzle.name}</Text>
            <Text style={styles.puzzleDescription}>{puzzle.description}</Text>
            <TouchableOpacity
            styles={styles.addQuestionCard}
            onPress={() => {
              setSelectedPuzzleId(puzzle._id);
              setSelectedLevelName('');
              setIsVisible(true);
            }}>
              <Text style={styles.buttonText}>➕ Add Question</Text>
            </TouchableOpacity>
          </View>
        ))}
      </View>

      {/* Add Question Modal */}
      <Modal visible={isVisible} animationType="fade" transparent={true} onRequestClose={() => setIsVisible(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <TouchableOpacity onPress={() => setIsVisible(false)} style={styles.cancelIcon}><Text>✖️</Text></TouchableOpacity>
            <Text style={styles.subtitle}>Select Level to Add Question</Text>
            <Picker selectedValue={selectedLevelName} onValueChange={setSelectedLevelName} style={styles.input}>
              <Picker.Item label="-- Select Level --" value="" />
              {createdPuzzles.find(p => p._id === selectedPuzzleId)?.levels.map((lvl, index) => (
                <Picker.Item key={index} label={lvl.name} value={lvl.name} />
              ))}
            </Picker>
            <TextInput placeholder="Question" value={newQuestion} onChangeText={setNewQuestion} style={styles.inputSmall} />
            {newOptions.map((opt, idx) => (
              <TextInput key={idx} placeholder={`Option ${idx + 1}`} value={opt} onChangeText={(val) => {
                const updated = [...newOptions];
                updated[idx] = val;
                setNewOptions(updated);
              }} style={styles.inputSmall} />
            ))}
            <TextInput placeholder="Correct Answer" value={newAnswer} onChangeText={setNewAnswer} style={styles.inputSmall} />
            <TextInput placeholder="Hint" value={hint} onChangeText={setHint} style={styles.inputSmall} />
            <TextInput placeholder="Explanation" value={explanation} onChangeText={setExplanation} style={styles.inputSmall} />
            <TextInput placeholder="Points" value={points} keyboardType="numeric" onChangeText={setPoints} style={styles.inputSmall} />
            <TouchableOpacity style={styles.button} onPress={addQuestionToPuzzle}>
              <Text style={styles.buttonText}>Add Question</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Configure Level Modal */}
      <Modal visible={isLevelModalVisible} animationType="fade" transparent={true} onRequestClose={() => setIsLevelModalVisible(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <TouchableOpacity onPress={() => setIsLevelModalVisible(false)} style={styles.cancelIcon}><Text>✖️</Text></TouchableOpacity>
            <Text style={styles.subtitle}>Configure: {selectedLevelName}</Text>
            {selectedLevelName !== '' && (() => {
              const index = levels.findIndex(lvl => lvl.name === selectedLevelName);
              return (
                <>
                  <TextInput placeholder="Time Limit (seconds)" keyboardType="numeric" value={levels[index].timeLimit} onChangeText={(val) => updateLevel(index, 'timeLimit', val)} style={styles.inputSmall} />
                  <TextInput placeholder="Max Marks" keyboardType="numeric" value={levels[index].maxMarks} onChangeText={(val) => updateLevel(index, 'maxMarks', val)} style={styles.inputSmall} />
                  <TextInput placeholder="Passing Marks" keyboardType="numeric" value={levels[index].passingMarks} onChangeText={(val) => updateLevel(index, 'passingMarks', val)} style={styles.inputSmall} />
                </>
              );
            })()}
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 20,
    paddingHorizontal: Platform.OS === 'web' ? 40 : 20,
    backgroundColor: 'rgba(247, 247, 247, 0.6)',
    flexGrow: 1,
    marginTop:50,
  },
  title: {
    fontSize: 28,
    fontWeight: '400',
    marginBottom: 16,
    marginTop: 6,
    textAlign: 'center',
    color: '#333',
    textShadowColor: 'rgba(0, 0, 0, 0.15)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  subtitle: {
    fontSize: 18,
    fontWeight: '600',
    marginTop: 15,
    marginBottom: 6,
    color: '#222',
  },
  label: {
    marginTop: 10,
    fontWeight: '600',
    color: '#555',
  },
  input: {
    borderColor: 'rgba(128, 0, 128, 0.3)',
    borderWidth: 1,
    borderRadius: 10,
    padding: 12,
    marginVertical: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    shadowColor: 'rgba(128,0,128,0.1)',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 4,
  },
  inputSmall: {
    borderColor: 'rgba(128, 0, 128, 0.3)',
    borderWidth: 1,
    borderRadius: 10,
    padding: 10,
    marginVertical: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    fontSize: 14,
    shadowColor: 'rgba(128,0,128,0.1)',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 4,
  },
  sectionTitle: {
    fontSize: 22,
    marginTop: 30,
    marginBottom: 12,
    fontWeight: '400',
    fontFamily: 'Lato_400',
    color: '#444',
    textShadowColor: 'rgba(0, 0, 0, 0.1)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 5,
    height: '200%',
    
  },
  puzzleCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.85)',
    borderRadius: 20,
    padding: 18,
    marginBottom: 10,
    width: '100%',
    shadowColor: 'rgba(128, 0, 128, 0.4)',
    shadowOpacity: 0.5,
    shadowOffset: { width: 0, height: 6 },
    shadowRadius: 12,
    elevation: 8,
    borderWidth: 1,
    borderColor: 'rgba(128, 0, 128, 0.3)',
  },
  puzzleTitle: {
    fontSize: 17,
    fontWeight: 'bold',
    marginBottom: 6,
    color: '#5D005D',
  },
  puzzleDescription: {
    fontSize: 13,
    fontWeight: '300',
    marginBottom: 7,
    color: '#7B4D7B',
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.7)',
    paddingHorizontal: 16,
  },
  modalContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 25,
    padding: 30,
    marginHorizontal: 'auto',
    minWidth: '50%',
    maxWidth: 500,
    alignSelf: 'center',
    shadowColor: 'rgba(128, 0, 128, 0.5)',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.6,
    shadowRadius: 15,
    elevation: 12,
    borderWidth: 1,
    borderColor: 'rgba(128, 0, 128, 0.4)',
  },
  button: {
    backgroundColor: '#9932CC',
    paddingVertical: 14,
    borderRadius: 12,
    marginVertical: 10,
    alignItems: 'center',
    shadowColor: 'rgba(0, 0, 0, 0.3)',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 7,
    elevation: 6,
  },
    buttonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 16
  },
  addQuestionCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.85)',
    borderWidth: 0,
    borderRadius: 20,
    shadowColor: 'rgba(128, 0, 128, 0.4)',
    shadowOpacity: 0.5,
    shadowOffset: { width: 0, height: 8 },
    shadowRadius: 20,
    width: '100%',
    paddingVertical: 18,
    paddingHorizontal: 22,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 18,
    borderColor: 'rgba(128, 0, 128, 0.3)',
    borderWidth: 1,
  },
  addQuestionCardText: {
    color: '#7D26CD',
    fontWeight: '800',
    fontSize: 17,
    letterSpacing: 0.7,
  },
  cancelIcon: {
    alignSelf: 'flex-end',
    marginBottom: 12,
  },
  levelGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 1,
    marginBottom: 18,
    marginLeft: 10,
  },
  levelCard: {
    backgroundColor: 'rgba(216, 191, 216, 0.8)',
    paddingVertical: 8,
    paddingHorizontal: 2,
    borderRadius: 15,
    width: '30%',
    marginRight: 5,
    marginTop: 10,
    alignItems: 'center',
    shadowColor: 'rgba(128, 0, 128, 0.3)',
    shadowOpacity: 0.4,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 8,
    elevation: 5,
    borderWidth: 1,
    borderColor: 'rgba(128, 0, 128, 0.25)',
  },
  levelTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#6A0DAD',
  },
});

