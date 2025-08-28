import React from 'react';
import { View, Image, StyleSheet, Platform } from 'react-native';

const LogoHeader = () => {
  return (
    <View style={styles.container}>
      <Image source={require('../assets/Eduzzle3.png')}  style={styles.logo}/>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
  flexDirection: 'row',
  justifyContent: 'flex-end',
    alignItems: 'left',
    paddingTop: Platform.OS === 'web' ? 10 : 10,
    paddingBottom: 1,
    paddingHorizontal: 2,
    marginHorizontal: 1,
    backgroundColor: '#9c20b5ff', 
   
  },
  logo: {
    width: 150,
    height: 49,
    padding: 5,
    
  },
});

export default LogoHeader;
