import { StyleSheet } from 'react-native';


export const commonStyles = StyleSheet.create({
  profileContainer: {
    position: 'relative',
    alignItems: 'center',
    height: '45%',
    width: '100%',
  },
  username: {
    top: '10%',
    fontSize: 30,
    color: 'white',
  },
  profileIconContainer: {
    top: '15%',
    height: '40%',
    aspectRatio: 1,
  },
  buttonContainer: {
    position: 'relative',
    width: '80%',
    height: '7.5%',
    marginBottom: '12%',
  },
  buttonText: {
    top: '30%',
    fontSize: 21,
    color: 'black',
  },
  icon: {
    position: 'absolute',
    left: '2%',
    top: '15%',
    width: 47,
    height: 47,
  }
});