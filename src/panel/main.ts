import { randomName } from '../common/names';
import {
    PetSize,
    PetColor,
    PetType,
    Theme,
    ColorThemeKind,
    WebviewMessage,
} from '../common/types';
import { IPetType } from './states';
import {
    createPet,
    PetCollection,
    PetElement,
    IPetCollection,
    availableColors,
    InvalidPetException,
} from './pets';
import { BallState, PetElementState, PetPanelState } from './states';
var Icon = './pawprint.png';
var basePetUri = "media";

export var allPets: IPetCollection = new PetCollection();
var petCounter: number;

function calculateFloor(size: PetSize, theme: Theme): number {
    switch (theme) {
        case Theme.forest:
            switch (size) {
                case PetSize.small:
                    return 30;
                case PetSize.medium:
                    return 40;
                case PetSize.large:
                    return 65;
                case PetSize.nano:
                default:
                    return 23;
            }
        case Theme.castle:
            switch (size) {
                case PetSize.small:
                    return 60;
                case PetSize.medium:
                    return 80;
                case PetSize.large:
                    return 120;
                case PetSize.nano:
                default:
                    return 45;
            }
        case Theme.beach:
            switch (size) {
                case PetSize.small:
                    return 60;
                case PetSize.medium:
                    return 80;
                case PetSize.large:
                    return 120;
                case PetSize.nano:
                default:
                    return 45;
            }
    }
    return 0;
}

function petsContainerComponent() {
    const element = document.createElement('div');
    element.id = "petsContainer";

    return element;
}

function component() {
    const cvs = document.createElement('canvas');
    cvs.id = 'petCanvas';
    return cvs;
}

// function updateCanvas() {
//     var img = new Image();
//     img.onload = function() {
//         const canvas = document.getElementById('petCanvas');
//         var ctx = canvas.getContext('2d');
//         // ctx.drawImage(img, 0, 0);
//         var hRatio = canvas.width  / img.width    ;
//         var vRatio =  canvas.height / img.height  ;
//         var ratio  = Math.min ( hRatio, vRatio );
//         var centerShift_x = ( canvas.width - img.width*ratio ) / 2;
//         var centerShift_y = ( canvas.height - img.height*ratio ) / 2;  
//         ctx.clearRect(0,0,canvas.width, canvas.height);
//         ctx.drawImage(img, 0, 0, img.width, img.height,
//                             centerShift_x,centerShift_y,img.width*ratio, img.height*ratio);
//     }
//     img.src = Icon;
// }

function handleMouseOver(e: MouseEvent) {
    var el = e.currentTarget as HTMLDivElement;
    allPets.pets.forEach((element) => {
        if (element.collision === el) {
            if (!element.pet.canSwipe) {
                return;
            }
            element.pet.swipe();
        }
    });
}


function startAnimations(
    collision: HTMLDivElement,
    pet: IPetType,
) {

    collision.addEventListener('mouseover', handleMouseOver);
    setInterval(() => {
        pet.nextFrame();
    }, 100);
}

function addPetToPanel(
    petType: PetType,
    basePetUri: string,
    petColor: PetColor,
    petSize: PetSize,
    left: number,
    bottom: number,
    floor: number,
    name: string,
): PetElement {
    var petSpriteElement: HTMLImageElement = document.createElement('img');
    petSpriteElement.className = 'pet';
    (document.getElementById('petsContainer') as HTMLDivElement).appendChild(
        petSpriteElement,
    );

    var collisionElement: HTMLDivElement = document.createElement('div');
    collisionElement.className = 'collision';
    (document.getElementById('petsContainer') as HTMLDivElement).appendChild(
        collisionElement,
    );

    var speechBubbleElement: HTMLDivElement = document.createElement('div');
    speechBubbleElement.className = `bubble bubble-${petSize}`;
    speechBubbleElement.innerText = 'Hello!';
    (document.getElementById('petsContainer') as HTMLDivElement).appendChild(
        speechBubbleElement,
    );

    const root = basePetUri + '/' + petType + '/' + petColor;
    console.log('Creating new pet : ', petType, root, petColor, petSize, name);
    try {
        if (!availableColors(petType).includes(petColor)) {
            throw new InvalidPetException('Invalid color for pet type');
        }
        var newPet = createPet(
            petType,
            petSpriteElement,
            collisionElement,
            speechBubbleElement,
            petSize,
            left,
            bottom,
            root,
            floor,
            name,
        );
        // petCounter++;
        startAnimations(collisionElement, newPet);
    } catch (e: any) {
        // Remove elements
        petSpriteElement.remove();
        collisionElement.remove();
        speechBubbleElement.remove();
        throw e;
    }

    return new PetElement(
        petSpriteElement,
        collisionElement,
        speechBubbleElement,
        newPet,
        petColor,
        petType,
    );
}


function randomStartPosition(): number {
    return Math.floor(Math.random() * (window.innerWidth * 0.7));
}

let canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D;

function initCanvas() {

    canvas = document.getElementById('petCanvas') as HTMLCanvasElement;
    if (!canvas) {
        console.log('Canvas not ready');
        return;
    }
    ctx = canvas.getContext('2d') as CanvasRenderingContext2D;
    if (!ctx) {
        console.log('Canvas context not ready');
        return;
    }
    ctx.canvas.width = window.innerWidth;
    ctx.canvas.height = window.innerHeight;
}

window.addEventListener('resize', function () {
    initCanvas();
});

document.body.appendChild(component());
document.body.appendChild(petsContainerComponent());
initCanvas();
var newPet = addPetToPanel(PetType.totoro, basePetUri, PetColor.gray, PetSize.small, randomStartPosition(), 0, 0, PetType.totoro);
allPets.push(newPet);
// addPetToPanel(
//     PetType.cat,
//     basePetUri,
//     PetColor.brown,
//     PetSize.small,
//     parseInt('0'),
//     parseInt('0'),
//     0,
//     PetType.cat
// );