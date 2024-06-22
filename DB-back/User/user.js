const express = require('express');
const { auth, db, storage } = require('../Config/index.js');
const { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, sendPasswordResetEmail  } = require('firebase/auth');
const { doc, getDoc, setDoc } = require('firebase/firestore');

const router = express.Router();

router.post('/signUpUser', async (req, res) => {
    try {
        const { nome, sobrenome, email, password } = req.body;

        async function signUp(nome, sobrenome, email, password ) {
            await createUserWithEmailAndPassword(auth, email, password)
                .then(async (value) => {
                    let uid = value.user.uid;

                    await setDoc(doc(db, 'users', uid), { 
                        nome: nome,
                        sobrenome: sobrenome,
                        email: value.user.email,
                        sorteado: false,
                        avatarUrl: null
                    });

                    const userData = {
                        uid: uid,
                        nome: nome,
                        sobrenome: sobrenome,
                        email: value.user.email,
                        sorteado: false,
                        avatarUrl: null
                    };

                    res.status(201).send(userData);
                })
                .catch((error) => {
                    res.status(500).send(error);
                });
        }

        await signUp(nome, sobrenome, email, password);

    } catch (error) {
        res.status(500).send(error);
    }
});

router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        async function signIn(email, password) {
            await signInWithEmailAndPassword(auth, email, password)
            .then(async (value) => {
                let uid = value.user.uid;
                const docRef = doc(db, 'users', uid);
                const docSnap = await getDoc(docRef);

                if (docSnap.exists()) {
                    let data = {
                        uid: uid,
                        nome: docSnap.data().nome,
                        sobrenome: docSnap.data().sobrenome,
                        email: value.user.email,
                        sorteado: docSnap.data().sorteado,
                        avatarUrl: docSnap.data().avatarUrl,
                    };

                    res.status(200).send(data);
                } else {
                    res.status(404).send('User data not found');
                }
            }).catch((error) => {
                switch (error.code) {
                    case 'auth/user-not-found':
                        res.status(404).send('User not found');
                        break;
                    case 'auth/wrong-password':
                        res.status(400).send('Invalid credentials');
                        break;
                    default:
                        res.status(500).send('Ops, something went wrong, try again later!');
                        break;
                }
            });
        }

        await signIn(email, password);
    } catch (error) {
        res.status(500).send(error.message);
    }
});

router.post('/recoverPassword', async (req, res) => {
    try {
        const { email } = req.body; 
        if (!email) {
            return res.status(400).send('Email is required');
        }

        async function recoverPassword(email){
            await sendPasswordResetEmail(auth, email)
            .then(() => {
                res.status(200).send('email de recuperação enviado com sucesso!');
            })
            .catch((error) => {
                res.status(501).send('Failed to recover password: ' + error);
            });
        }

        await recoverPassword(email)
    } catch (error) {
        res.status(502).send('Failed to recover password: ' + error);
    }
});

module.exports = router;