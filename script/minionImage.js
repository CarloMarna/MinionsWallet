import MinionShout from '../assets/img/icone_minions/Minion-Shout.png';
import MinionsNewYork from '../assets/img/icone_minions/Minions-NewYork.png';
import MinionsPillola from '../assets/img/icone_minions/Minions-Pillola.png';
import MinionsSadChristmas from '../assets/img/icone_minions/Minions-Sad-Christmas.png';
import MinionsSpa from '../assets/img/icone_minions/Minions-Spa.png';
import MinionsTechnology from '../assets/img/icone_minions/Minions-Technology.png';
import MinionsToy from '../assets/img/icone_minions/Minions-Toy.png';
import MinionsTransport from '../assets/img/icone_minions/Minions-Transport.png';
import MinionsVacay from '../assets/img/icone_minions/Minions-Vacay.png';
import MinionsWoman from '../assets/img/icone_minions/Minions-Woman.png';
import MinionBananas from '../assets/img/icone_minions/Minion-Bananas.png';
import MinionCake from '../assets/img/icone_minions/Minion-Cake.png';
import MinionCrazy from '../assets/img/icone_minions/Minion-Crazy.png';
import MinionDancing from '../assets/img/icone_minions/Minion-Dancing.png';
import MinionDuck from '../assets/img/icone_minions/Minion-Duck.png';
import MinionEvil from '../assets/img/icone_minions/Minion-Evil.png';
import MinionFruits from '../assets/img/icone_minions/Minion-Fruits.png';
import MinionKungfu from '../assets/img/icone_minions/Minion-Kungfu.png';
import MinionMaid from '../assets/img/icone_minions/Minion-Maid.png';
import MinionPlayingGolf from '../assets/img/icone_minions/Minion-Playing-Golf.png';
import MinionReading from '../assets/img/icone_minions/Minion-Reading.png';
import MinionSad from '../assets/img/icone_minions/Minion-Sad.png';
import MinionsChef from '../assets/img/icone_minions/Minions-Chef.png';
import MinionsChitarra from '../assets/img/icone_minions/Minions-Chitarra.png';
import MinionsChristmas from '../assets/img/icone_minions/Minions-Christmas.png';
import MinionsFesta from '../assets/img/icone_minions/Minions-Festa.png';

const getImageFromPath = (path) => {
    const fileName = path.split('/').pop().split('.')[0].replaceAll('-', '');
    switch (fileName) {
        case 'MinionShout':
            return MinionShout;
        case 'MinionsNewYork':
            return MinionsNewYork;
        case 'MinionsPillola':
            return MinionsPillola;
        case 'MinionsSadChristmas':
            return MinionsSadChristmas;
        case 'MinionsSpa':
            return MinionsSpa;
        case 'MinionsTechnology':
            return MinionsTechnology;
        case 'MinionsToy':
            return MinionsToy;
        case 'MinionsTransport':
            return MinionsTransport;
        case 'MinionsVacay':
            return MinionsVacay;
        case 'MinionsWoman':
            return MinionsWoman;
        case 'MinionBananas':
            return MinionBananas;
        case 'MinionCake':
            return MinionCake;
        case 'MinionCrazy':
            return MinionCrazy;
        case 'MinionDancing':
            return MinionDancing;
        case 'MinionDuck':
            return MinionDuck;
        case 'MinionEvil':
            return MinionEvil;
        case 'MinionFruits':
            return MinionFruits;
        case 'MinionKungfu':
            return MinionKungfu;
        case 'MinionMaid':
            return MinionMaid;
        case 'MinionPlayingGolf':
            return MinionPlayingGolf;
        case 'MinionReading':
            return MinionReading;
        case 'MinionSad':
            return MinionSad;
        case 'MinionsChef':
            return MinionsChef;
        case 'MinionsChitarra':
            return MinionsChitarra;
        case 'MinionsChristmas':
            return MinionsChristmas;
        case 'MinionsFesta':
            return MinionsFesta;
        default:
            return '';
    }
};
export {
    MinionShout,
    MinionsNewYork,
    MinionsPillola,
    MinionsSadChristmas,
    MinionsSpa,
    MinionsTechnology,
    MinionsToy,
    MinionsTransport,
    MinionsVacay,
    MinionsWoman,
    MinionBananas,
    MinionCake,
    MinionCrazy,
    MinionDancing,
    MinionDuck,
    MinionEvil,
    MinionFruits,
    MinionKungfu,
    MinionMaid,
    MinionPlayingGolf,
    MinionReading,
    MinionSad,
    MinionsChef,
    MinionsChitarra,
    MinionsChristmas,
    MinionsFesta,
    getImageFromPath
};


