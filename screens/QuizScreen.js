import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Text, Button, } from 'react-native';
import * as jsonFile from '../assets/questions.json';
import Questions from '../models/Questions';
import RadioButtonRN from 'radio-buttons-react-native';

const QuizScreen = ({ navigation }) => {

    /*Load quiz questions from json file*/
    const jsonData = jsonFile.questions;
    let loadedQuestions = [];
    jsonData.forEach((question) => {
        loadedQuestions.push(new Questions(
            question.questionText,
            question.answers,
            question.correct
        ));
    });
    /* variables to navigate quiz in a single route*/
    const [questionIndex, setQuestionIndex] = useState(0);
    const [initValue, setInitValue] = useState(-1);
    const [selectedAnser, setSelectedAnswer] = useState('');
    const [score, setScore] = useState(0);

    /*variables to store score into file*/
    var RNFS = require('react-native-fs');
    var path = RNFS.DocumentDirectoryPath + '/score.txt';

    /*write score into a file after last question*/
    useEffect(() => {
        if (questionIndex == 4) {
            RNFS.writeFile(path, score.toString(), 'utf8')
                .then((success) => {
                    navigation.navigate('profileForm', { final: score });
                })
                .catch((error) => {
                    throw new Error(error.toString());
                });
        }
    }, [score, questionIndex]);

    /* naviagte through questions*/
    const nextButtonHandler = () => {
        if (questionIndex < 3) {
            if (selectedAnser === loadedQuestions[questionIndex].correct) {
                setScore(score => score + 1);
            }
            setQuestionIndex(questionIndex => questionIndex + 1);
            setInitValue(initValue => initValue - 1);
        } else {
            if (selectedAnser === loadedQuestions[questionIndex].correct) {
                setScore(score => score + 1);
            }
            setQuestionIndex(questionIndex => questionIndex + 1);
        }
        setSelectedAnswer('');

    };

    if (questionIndex < 4) {
        return (
            <View style={styles.screen} >
                <Text style={styles.questionText}>{loadedQuestions[questionIndex].questionText}</Text>
                <View style={styles.radio}>
                    <RadioButtonRN
                        data={loadedQuestions[questionIndex].answers}
                        selectedBtn={(e) => {
                            if (e) {
                                setSelectedAnswer(e.label);
                            }
                        }}
                        textColor='#383838'
                        initial={initValue}
                    />
                </View>
                {selectedAnser !== '' && <Button style={styles.button}
                    title={questionIndex < 3 ? 'Next Question' : 'End Quiz'}
                    onPress={nextButtonHandler}
                />}
            </View >
        );
    } else {
        return null;
    }
};

const styles = StyleSheet.create({
    screen: {
        flex: 1,
        alignItems: 'center'
    },
    radio: {
        width: '100%',
        marginBottom: 10,

    },
    questionText: {
        fontSize: 20,
        textAlign: 'center',
        color: '#2196f3',
        marginTop: 20,
    },
    button: {
        width: 30

    }

});

export default QuizScreen;