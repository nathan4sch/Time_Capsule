import { StyleSheet } from 'react-native';

export const commonStyles = StyleSheet.create({
backButtonTop: {
    position: 'absolute',
    top: 30,
    left: 10,
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 8,

 /*   borderColor: 'blue',
    borderWidth: 2,*/
},
arrowContainer: {
    width: 27,
    height: 27,
    transform: [{ rotate: '180deg' }],
/*    borderColor: 'red',
    borderWidth: 2,*/
},
arrowLine: {
    flex: 1,
    height: 3,
    backgroundColor: 'black',
    margin: 2,
/*    borderColor: 'green',
    borderWidth: 2,*/
},

title: {
    alignSelf: 'flex-start',
    fontSize: 18,
    paddingHorizontal: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    color: 'white',
  },
line: {
    alignSelf: 'flex-start',
    position: 'relative',
    height: 1,
    width: '90%',
    top: 25,
    backgroundColor: '#FFFFFF',
  },
listContainer: {
    position: 'absolute',
    top: '10%',
    width: '100%',
    height: '90%',
    alignItems: 'center',
    /*borderColor: 'red',
    borderWidth: 2,*/
},
listItemContainer: {
    width: 380,
    height: 41,
    backgroundColor: 'rgba(255, 255, 255, 0.74)',
    borderRadius: 10,
    marginBottom: 10,
    paddingHorizontal: 20,
    /*borderColor: 'blue',
    borderWidth: 2,*/
},
acceptButton: {
    top: -35,
    right: '23%',
    position: 'relative',
    alignSelf: 'flex-end',
    width: '20%',
    height: '60%',
    backgroundColor: '#85C1A4',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    borderRadius: 5,
  },
  rejectButton: {
    top: -12,
    position: 'relative',
    alignSelf: 'flex-end',
    width: '20%',
    height: '60%',
    backgroundColor: '#F87878',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    borderRadius: 5,
  },
  removeButton: {
    top: -12,
    left: 3,
    position: 'relative',
    alignSelf: 'flex-end',
    width: '25%',
    height: '60%',
    backgroundColor: '#F87878',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    borderRadius: 5,
  },
buttonText: {
    fontFamily: 'Arial',
    fontStyle: 'normal',
    fontWeight: '400',
    fontSize: 15,
    lineHeight: 27,
    textAlign: 'center',
    color: '#000000',
},
  separator: {
    height: 1,
    backgroundColor: 'transparent',
    marginVertical: 10,
  },
  usernameText: {
    fontSize: 16,
    top: '25%',
    color: 'black',
  },
});