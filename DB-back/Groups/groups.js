const express = require('express');
const { auth, db, storage } = require('../Config/index.js');
const { collection, getDocs, query, orderBy, where, updateDoc, doc, arrayUnion, getDoc, setDoc, deleteDoc, arrayRemove } = require('firebase/firestore');

const router = express.Router();

function gerarGroupUid() {
    const caracteres = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let codigo = '';
    for (let i = 0; i < 28; i++) {
        codigo += caracteres.charAt(Math.floor(Math.random() * caracteres.length));
    }
    return codigo;
}

router.post('/groupRegister', async (req, res) => {
    try {
        const { nome, qtdMax, valor, dataRevelacao, descricao, adminUid, participantes, image } = req.body;
        const groupId = gerarGroupUid();
        
        await setDoc(doc(db, 'groups', groupId), {
            groupId,
            nome,
            qtdMax,
            valor,
            dataRevelacao,
            descricao,
            adminUid,
            participantes,
            image,
            sorteado: false,
        });

        const groupData = {
            groupId,
            nome,
            qtdMax,
            valor,
            dataRevelacao,
            descricao,
            adminUid,
            participantes,
            groupId,
            image,
            sorteado: false,
            pares: []
        };
        res.status(200).send(groupData);
    } catch (error) {
        console.error('Error in groupRegister:', error);
        res.status(500).send(error);
    }
});

router.post('/getGroupList', async (req, res) => {
    try {
        const { userDatail } = req.body;
        if (userDatail) {
            const groupRef = collection(db, 'groups');
            const q = query(groupRef, orderBy('nome', 'desc'), where('participantes', 'array-contains', userDatail.uid));
            const querySnapshot = await getDocs(q);

            let lista = [];
            querySnapshot.forEach((doc) => {
                lista.push({ ...doc.data(), id: doc.id });
            });

            res.status(200).send(lista);
        } else {
            res.status(400).send({ error: 'Detalhes do usuário não fornecidos.' });
        }
    } catch (error) {
        res.status(500).send(error);
    }
});

router.post('/addParticipant', async (req, res) => {
    try {
        const { groupId, userUid } = req.body;

        if (!groupId || !userUid) {
            return res.status(400).send({ error: 'groupId e userUid são necessários.' });
        }

        const groupRef = doc(db, 'groups', groupId);
        const groupSnap = await getDoc(groupRef);

        if (!groupSnap.exists()) {
            return res.status(404).send({ error: 'Grupo não encontrado.' });
        }

        const groupData = groupSnap.data();

        if (groupData.participantes.length >= groupData.qtdMax) {
            return res.status(400).send('O grupo já atingiu a quantidade máxima de participantes.');
        }

        await updateDoc(groupRef, {
            participantes: arrayUnion(userUid)
        });

        res.status(200).send({ message: 'Participante adicionado com sucesso.' });
    } catch (error) {
        console.error('Error in addParticipant:', error);
        res.status(500).send(error);
    }
});
router.post('/getParticipants', async (req, res) => {
    try {
        const { groupId } = req.body; 
        if (!groupId) {
            return res.status(400).send({ error: 'groupId é necessário' });
        }

        const groupRef = doc(db, 'groups', groupId); 
        const groupSnap = await getDoc(groupRef);

        if (!groupSnap.exists()) {
            return res.status(404).send('Grupo não encontrado'); 
        }

        const groupData = groupSnap.data();
        const participants = groupData.participantes;

        if (!participants || participants.length === 0) {
            return res.status(204).send('Não há participantes neste grupo'); 
        }

        const usersPromises = participants.map(async (userId) => {
            const userRef = doc(db, 'users', userId);
            const userSnap = await getDoc(userRef);

            if (userSnap.exists()) {
                return {
                    userId,
                    nome: userSnap.data().nome,
                    email: userSnap.data().email,
                    avatarUrl: userSnap.data().avatarUrl,
                };
            } else {
                return {
                    userId,
                    nome: 'Usuário não encontrado',
                    email: 'Não disponível',
                    avatarUrl: 'Avatar não disponível',
                };
            }
        });

        const users = await Promise.all(usersPromises);

        res.status(200).send(users);
    } catch (error) {
        console.error('Erro ao buscar participantes:', error);
        res.status(500).send(error);
    }
});

router.post('/updateGroup', async (req, res) => {
    try {
        const { groupId, nome, qtdMax, valor, dataRevelacao, descricao, adminUid, participantes, image } = req.body;

        if(!groupId){
            return res.status(400).send({ error: 'groupId é necessário' });
        }

        const groupRef = doc(db, 'groups', groupId);
        await updateDoc(groupRef, {
            groupId,
            nome,
            qtdMax,
            valor,
            dataRevelacao,
            descricao,
            adminUid,
            participantes,
            image
        });

        res.status(200).send({ message: 'Grupo atualizado com sucesso.' });
    }
    catch(error){
        console.log('Erro ao atualizar grupo: ', error)
        res.status(500).send(error);
    }
})


router.post('/getGroupById', async (req, res) => {
    try {
        const { groupId } = req.body;
        if (!groupId) {
            return res.status(400).send({ error: 'groupId é necessário' });
        }

        const groupRef = doc(db, 'groups', groupId);
        const groupSnap = await getDoc(groupRef);

        if (!groupSnap.exists()) {
            return res.status(404).send('Grupo não encontrado');
        }

        const groupData = groupSnap.data();
        res.status(200).send(groupData);
    } catch (error) {
        console.error('Erro ao buscar dados do grupo:', error);
        res.status(500).send(error);
    }
});

router.post('/sortear', async (req, res) => {
    try {
        const { groupId } = req.body;

        if (!groupId) {
            return res.status(300).send({ error: 'groupId é necessário' });
        }

        const groupRef = doc(db, 'groups', groupId);
        const groupSnap = await getDoc(groupRef);

        if (!groupSnap.exists()) {
            return res.status(301).send('Grupo não encontrado');
        }

        const groupData = groupSnap.data();

        // Verifica se o grupo já foi sorteado
        if (groupData.sorteado) {
            return res.status(302).send('Este grupo já foi sorteado.');
        }

        let participants = groupData.participantes;
        const dataRevelacaoStr = groupData.dataRevelacao;

        if (!participants || participants.length === 0) {
            return res.status(204).send('Não há participantes neste grupo');
        }

        // Converte a string "DD/MM/AAAA" para um objeto Date
        const [day, month, year] = dataRevelacaoStr.split('/');
        const dataRevelacao = new Date(year, month - 1, day);

        const currentDate = new Date();
        if (currentDate < dataRevelacao) {
            return res.status(303).send('A data de revelação ainda não chegou');
        }

        shuffleArray(participants);

        let pairs = [];
        for (let i = 0; i < participants.length; i += 2) {
            if (i + 1 < participants.length) {
                pairs.push([participants[i], participants[i + 1]]);
            } else {
                pairs.push([participants[i], "Deus"]);
            }
        }

        let flattenedPairs = [];
        for (let i = 0; i < participants.length; i += 2) {
            if (i + 1 < participants.length) {
                flattenedPairs.push({
                    participant1: participants[i],
                    participant2: participants[i + 1]
                });
            } else {
                flattenedPairs.push({
                    participant1: participants[i],
                    participant2: "Deus" // ou alguma outra designação especial
                });
            }
        }

        await updateDoc(groupRef, {
            pares: flattenedPairs,
            sorteado: true
        });

        res.status(200).send(pairs);
    } catch (error) {
        console.error('Erro ao sortear participantes:', error);
        res.status(500).send(error);
    }
});


function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

router.post('/deleteGroup', async (req, res) => {
    try {
        const { groupId } = req.body;

        if (!groupId) {
            return res.status(300).send('groupId é necessário');
        }

        const groupRef = doc(db, 'groups', groupId);
        const groupSnap = await getDoc(groupRef);

        if (!groupSnap.exists()) {
            return res.status(304).send('Grupo não encontrado');
        }

        await deleteDoc(groupRef);

        res.status(200).send('Grupo apagado com sucesso.');
    } catch (error) {
        console.error('Erro ao apagar o grupo:', error);
        res.status(500).send(error);
    }
});

router.post('/removeParticipant', async (req, res) => {
    try {
        const { groupId, userUid } = req.body;

        if (!groupId || !userUid) {
            return res.status(300).send({ error: 'groupId e userUid são necessários.' });
        }

        const groupRef = doc(db, 'groups', groupId);
        const groupSnap = await getDoc(groupRef);

        if (!groupSnap.exists()) {
            return res.status(304).send({ error: 'Grupo não encontrado.' });
        }

        await updateDoc(groupRef, {
            participantes: arrayRemove(userUid)
        });

        res.status(200).send({ message: 'Participante removido com sucesso.' });
    } catch (error) {
        console.error('Error in removeParticipant:', error);
        res.status(500).send(error);
    }
});


module.exports = router;
