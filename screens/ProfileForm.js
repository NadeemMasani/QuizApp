import React, { useState, useEffect } from 'react';
import {
    View,
    ScrollView,
    Text,
    TextInput,
    StyleSheet,
    Button,
    ActivityIndicator,
    Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

/*Componet to Show card*/
import Card from '../components/Card';


const ProfileForm = ({ navigation, route }) => {
    // fileSystem variables to store and retirve score*/
    var RNFS = require('react-native-fs');
    const rootPath = RNFS.DocumentDirectoryPath;
    const scoreFile = '/score.txt';

    //variables to save state of form fields
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [nickName, setNickName] = useState('');
    const [age, setAge] = useState('');
    const [loadedScore, setLoadedScore] = useState('Not Available');

    //variables to validate form fields
    const [firstNameIsValid, setFirstNameIsValid] = useState(true);
    const [lastNameIsValid, setLastNameIsValid] = useState(true);
    const [nickNameIsValid, setNickNameIsValid] = useState(true);
    const [ageIsValid, setAgeIsValid] = useState(true);
    const [isLoading, setIsLoading] = useState(false);

    /*Load default profile data from Async Storage and score from file*/
    useEffect(() => {
        const loadProfileInfo = async () => {
            setIsLoading(true);
            const loadedProfileData = JSON.parse(await AsyncStorage.getItem('profileInformation'));
            if (loadedProfileData) {
                /* set default profile information data to current state */
                setFirstName(loadedProfileData['firstName']);
                setLastName(loadedProfileData['lastName']);
                setNickName(loadedProfileData['nickName']);
                setAge(loadedProfileData['age']);
            }
        }
        const loadScore = async () => {
            var path = rootPath + scoreFile;
            if (await RNFS.exists(path)) {
                var loadedScore = await RNFS.readFile(path, 'utf8');
                if (loadScore) {
                    setLoadedScore(loadedScore);
                }
            }
            setIsLoading(false);
        }
        loadProfileInfo();
        loadScore();
    }, []);
    /*show success alert on saving data to async storage*/
    const savedDataAlert = () =>
        Alert.alert(
            "Success",
            "Profile Data stored successfully",
            [
                { text: "OK" }
            ],
            { cancelable: false }
        );
    /*store profile data in async storage*/
    const storeData = async (profileData) => {
        try {
            const jsonProfileData = JSON.stringify(profileData);
            await AsyncStorage.setItem('profileInformation', jsonProfileData);
        } catch (error) {
            // error while saving in async storage
            throw new Error(error.toString());

        }
        return true;
    }
    /*validate all profile information and call storeData to store in async storage*/
    const onSubmitHandler = (show) => {
        if (firstName.trim().length == 0) {
            setFirstNameIsValid(false);
            return false;
        } else {
            setFirstNameIsValid(true);
            setFirstName(firstName.trim());
        }

        if (lastName.trim().length == 0) {
            setLastNameIsValid(false);
            return false;
        } else {
            setLastNameIsValid(true);
            setLastName(lastName.trim())
        }
        if (nickName.trim().length == 0) {
            setNickNameIsValid(false);
            return false;
        } else {
            setNickNameIsValid(true);
            setNickName(nickName.trim());
        }

        if (age.trim().length == 0) {
            setAgeIsValid(false);
            return false;
        } else if (!parseInt(age.trim())) {
            setAgeIsValid(false);
            return false;
        }
        else {
            if ((parseInt(age.trim()) < 0) || (parseInt(age.trim()) > 100)) {
                setAgeIsValid(false);
                return false;
            }
            setAgeIsValid(true);
            setAge(age.trim());
        }
        if (storeData({
            'firstName': firstName.trim(),
            'lastName': lastName.trim(),
            'nickName': nickName.trim(),
            'age': age.trim()
        })) {
            if (show) {
                savedDataAlert();
            }
        }

        return true;
    }

    /* show loading spinner untill data from async storage and file are loaded*/
    if (isLoading) {
        return (
            <View style={styles.loadingSpinner}>
                <ActivityIndicator size='large' color='blue' />
            </View>
        );

    }
    /*Profile Form*/
    return (<ScrollView>
        <View style={styles.form}>
            <Text style={styles.formText}>Please enter your Profile Information</Text>
            <Card style={styles.cardContainer}>
                <View style={styles.inputView}>
                    <Text style={styles.label}>First Name</Text>
                    <TextInput
                        style={styles.input}
                        value={firstName}
                        onChangeText={text => setFirstName(text)}
                    />
                    {!firstNameIsValid && <Text style={styles.errorText}>Please enter a valid First name</Text>}
                </View>
                <View style={styles.inputView}>
                    <Text style={styles.label}>Last Name</Text>
                    <TextInput
                        style={styles.input}
                        value={lastName}
                        onChangeText={text => setLastName(text)}
                    />
                    {!lastNameIsValid && <Text style={styles.errorText}>Please enter a valid Last name</Text>}

                </View>
                <View style={styles.inputView}>
                    <Text style={styles.label}>Nick Name</Text>
                    <TextInput
                        style={styles.input}
                        value={nickName}
                        onChangeText={text => setNickName(text)}
                    />
                    {!nickNameIsValid && <Text style={styles.errorText}>Please enter a valid Nick name</Text>}

                </View>
                <View style={styles.inputView}>
                    <Text style={styles.label}>Age</Text>
                    <TextInput
                        style={styles.input}
                        value={age}
                        onChangeText={text => setAge(text)}
                        keyboardType='number-pad'

                    />
                    {!ageIsValid && <Text style={styles.errorText}>Please enter a valid age betwee 0 to 100</Text>}
                </View>
                <View style={styles.button}>
                    <Button
                        title="Save"
                        onPress={() => { onSubmitHandler(true) }}
                    />
                </View>
                <View style={styles.button}>
                    <Button
                        title="Start Quiz"
                        onPress={() => {
                            if (onSubmitHandler(false)) {
                                navigation.navigate('quizScreen');
                            }
                        }
                        }
                    />
                </View>
                <Text style={styles.score}>Latest Score : {route.params ? route.params.final.toString() : loadedScore}/4 </Text>
            </Card>
        </View>
    </ScrollView>

    );
};

const styles = StyleSheet.create({
    form: {
        flex: 1,
        padding: 5,
        alignItems: 'center',
        margin: 10,
    },
    inputView: {
        width: '100%',
    },
    label: {
        marginVertical: 8,
    },
    input: {
        paddingHorizontal: 2,
        paddingVertical: 5,
        borderBottomColor: '#ccc',
        borderBottomWidth: 2,
    },
    cardContainer: {
        width: 400,
        maxWidth: '90%',
        alignItems: 'center',
        shadowColor: 'black',

    },
    loadingSpinner: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },

    button: {
        marginTop: 10,
    },
    errorText: {
        color: 'red',
        fontStyle: 'italic'
    },
    score: {
        color: '#2196f3',
        fontSize: 15,
        fontWeight: 'bold',
        marginTop: 10
    },
    formText: {
        fontSize: 20,
        fontStyle: "italic",
        textAlign: 'center',
        color: '#2196f3'
    }

});

export default ProfileForm;