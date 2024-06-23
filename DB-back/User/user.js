const express = require('express');
const { auth, db } = require('../Config/index.js');
const { createUserWithEmailAndPassword, signInWithEmailAndPassword, sendEmailVerification, sendPasswordResetEmail, signOut } = require('firebase/auth');
const { doc, getDoc, setDoc } = require('firebase/firestore');

const router = express.Router();

router.post('/signUpUser', async (req, res) => {
    try {
        const { nome, sobrenome, email, password } = req.body;

        async function signUp(nome, sobrenome, email, password) {
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

                    await sendEmailVerification(value.user);

                    res.status(201).send({ message: 'Conta criada com sucesso. Verifique seu e-mail para confirmar a conta.' });
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
                    if (!value.user.emailVerified) {
                        return res.status(401).send('Por favor, verifique seu e-mail antes de fazer login.');
                    }

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
                        res.status(404).send('Dados do usuário não encontrados');
                    }
                }).catch((error) => {
                    switch (error.code) {
                        case 'auth/user-not-found':
                            res.status(404).send('Usuário não encontrado');
                            break;
                        case 'auth/wrong-password':
                            res.status(400).send('Credenciais inválidas');
                            break;
                        default:
                            res.status(500).send('Ops, algo deu errado. Tente novamente mais tarde!');
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
            return res.status(400).send('Email é necessário');
        }

        async function recoverPassword(email) {
            await sendPasswordResetEmail(auth, email)
                .then(() => {
                    res.status(200).send('Email de recuperação enviado com sucesso!');
                })
                .catch((error) => {
                    res.status(501).send('Falha ao recuperar a senha: ' + error);
                });
        }

        await recoverPassword(email)
    } catch (error) {
        res.status(502).send('Falha ao recuperar a senha: ' + error);
    }
});

router.post('/getUserByUid', async (req, res) => {
    try {
        const { uid } = req.body;

        if (!uid) {
            return res.status(400).send({ error: 'UID é necessário' });
        }

        const userRef = doc(db, 'users', uid);
        const userSnap = await getDoc(userRef);

        if (!userSnap.exists()) {
            return res.status(399).send('Usuário não encontrado');
        }

        const userData = userSnap.data();
        res.status(200).send(userData);
    } catch (error) {
        console.error('Erro ao buscar usuário pelo UID:', error);
        res.status(500).send(error);
    }
});

module.exports = router;
