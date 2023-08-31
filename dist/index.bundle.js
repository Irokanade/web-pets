"use strict";
(self["webpackChunkpetstest"] = self["webpackChunkpetstest"] || []).push([["index"],{

/***/ "./src/panel/basepettype.ts":
/*!**********************************!*\
  !*** ./src/panel/basepettype.ts ***!
  \**********************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.BasePetType = exports.InvalidStateException = void 0;
const states_1 = __webpack_require__(/*! ./states */ "./src/panel/states.ts");
class InvalidStateException {
}
exports.InvalidStateException = InvalidStateException;
class BasePetType {
    label = 'base';
    static count = 0;
    sequence = {
        startingState: "sit-idle" /* States.sitIdle */,
        sequenceStates: [],
    };
    static possibleColors;
    currentState;
    currentStateEnum;
    holdState;
    holdStateEnum;
    el;
    collision;
    speech;
    _left;
    _bottom;
    petRoot;
    _floor;
    _friend;
    _name;
    _speed;
    _size;
    constructor(spriteElement, collisionElement, speechElement, size, left, bottom, petRoot, floor, name, speed) {
        this.el = spriteElement;
        this.collision = collisionElement;
        this.speech = speechElement;
        this.petRoot = petRoot;
        this._floor = floor;
        this._left = left;
        this._bottom = bottom;
        this.initSprite(size, left, bottom);
        this.currentStateEnum = this.sequence.startingState;
        this.currentState = (0, states_1.resolveState)(this.currentStateEnum, this);
        this._name = name;
        this._size = size;
        this._speed = this.randomizeSpeed(speed);
        // Increment the static count of the Pet class that the constructor belongs to
        this.constructor.count += 1;
    }
    initSprite(petSize, left, bottom) {
        this.el.style.left = `${left}px`;
        this.el.style.bottom = `${bottom}px`;
        this.el.style.width = 'auto';
        this.el.style.height = 'auto';
        this.el.style.maxWidth = `${this.calculateSpriteWidth(petSize)}px`;
        this.el.style.maxHeight = `${this.calculateSpriteWidth(petSize)}px`;
        this.collision.style.left = `${left}px`;
        this.collision.style.bottom = `${bottom}px`;
        this.collision.style.width = `${this.calculateSpriteWidth(petSize)}px`;
        this.collision.style.height = `${this.calculateSpriteWidth(petSize)}px`;
        this.speech.style.left = `${left}px`;
        this.speech.style.bottom = `${bottom + this.calculateSpriteWidth(petSize)}px`;
        this.hideSpeechBubble();
    }
    get left() {
        return this._left;
    }
    get bottom() {
        return this._bottom;
    }
    repositionAccompanyingElements() {
        this.collision.style.left = `${this._left}px`;
        this.collision.style.bottom = `${this._bottom}px`;
        this.speech.style.left = `${this._left}px`;
        this.speech.style.bottom = `${this._bottom + this.calculateSpriteWidth(this._size)}px`;
    }
    calculateSpriteWidth(size) {
        if (size === "nano" /* PetSize.nano */) {
            return 30;
        }
        else if (size === "small" /* PetSize.small */) {
            return 40;
        }
        else if (size === "medium" /* PetSize.medium */) {
            return 55;
        }
        else if (size === "large" /* PetSize.large */) {
            return 110;
        }
        else {
            return 30; // Shrug
        }
    }
    positionBottom(bottom) {
        this._bottom = bottom;
        this.el.style.bottom = `${this._bottom}px`;
        this.repositionAccompanyingElements();
    }
    positionLeft(left) {
        this._left = left;
        this.el.style.left = `${this._left}px`;
        this.repositionAccompanyingElements();
    }
    get width() {
        return this.el.width;
    }
    get floor() {
        return this._floor;
    }
    get hello() {
        // return the sound of the name of the animal
        return ` says hello 👋!`;
    }
    getState() {
        return { currentStateEnum: this.currentStateEnum };
    }
    get speed() {
        return this._speed;
    }
    randomizeSpeed(speed) {
        const min = speed * 0.7;
        const max = speed * 1.3;
        const newSpeed = Math.random() * (max - min) + min;
        return newSpeed;
    }
    get isMoving() {
        return this._speed !== 0 /* PetSpeed.still */;
    }
    recoverFriend(friend) {
        // Recover friends..
        this._friend = friend;
    }
    recoverState(state) {
        // TODO : Resolve a bug where if it was swiping before, it would fail
        // because holdState is no longer valid.
        this.currentStateEnum = state.currentStateEnum ?? "sit-idle" /* States.sitIdle */;
        this.currentState = (0, states_1.resolveState)(this.currentStateEnum, this);
        if (!(0, states_1.isStateAboveGround)(this.currentStateEnum)) {
            // Reset the bottom of the sprite to the floor as the theme
            // has likely changed.
            this.positionBottom(this.floor);
        }
    }
    get canSwipe() {
        return !(0, states_1.isStateAboveGround)(this.currentStateEnum);
    }
    get canChase() {
        return !(0, states_1.isStateAboveGround)(this.currentStateEnum) && this.isMoving;
    }
    showSpeechBubble(message, duration = 3000) {
        this.speech.innerHTML = message;
        this.speech.style.display = 'block';
        setTimeout(() => {
            this.hideSpeechBubble();
        }, duration);
    }
    hideSpeechBubble() {
        this.speech.style.display = 'none';
    }
    swipe() {
        if (this.currentStateEnum === "swipe" /* States.swipe */) {
            return;
        }
        this.holdState = this.currentState;
        this.holdStateEnum = this.currentStateEnum;
        this.currentStateEnum = "swipe" /* States.swipe */;
        this.currentState = (0, states_1.resolveState)(this.currentStateEnum, this);
        this.showSpeechBubble('👋');
    }
    chase(ballState, canvas) {
        this.currentStateEnum = "chase" /* States.chase */;
        this.currentState = new states_1.ChaseState(this, ballState, canvas);
    }
    faceLeft() {
        this.el.style.transform = 'scaleX(-1)';
    }
    faceRight() {
        this.el.style.transform = 'scaleX(1)';
    }
    setAnimation(face) {
        if (this.el.src.endsWith(`_${face}_8fps.gif`)) {
            return;
        }
        this.el.src = `${this.petRoot}_${face}_8fps.gif`;
    }
    chooseNextState(fromState) {
        // Work out next state
        var possibleNextStates = undefined;
        for (var i = 0; i < this.sequence.sequenceStates.length; i++) {
            if (this.sequence.sequenceStates[i].state === fromState) {
                possibleNextStates =
                    this.sequence.sequenceStates[i].possibleNextStates;
            }
        }
        if (!possibleNextStates) {
            throw new InvalidStateException();
        }
        // randomly choose the next state
        const idx = Math.floor(Math.random() * possibleNextStates.length);
        return possibleNextStates[idx];
    }
    nextFrame() {
        if (this.currentState.horizontalDirection === states_1.HorizontalDirection.left) {
            this.faceLeft();
        }
        else if (this.currentState.horizontalDirection === states_1.HorizontalDirection.right) {
            this.faceRight();
        }
        this.setAnimation(this.currentState.spriteLabel);
        // What's my buddy doing?
        if (this.hasFriend &&
            this.currentStateEnum !== "chase-friend" /* States.chaseFriend */ &&
            this.isMoving) {
            if (this.friend?.isPlaying &&
                !(0, states_1.isStateAboveGround)(this.currentStateEnum)) {
                this.currentState = (0, states_1.resolveState)("chase-friend" /* States.chaseFriend */, this);
                this.currentStateEnum = "chase-friend" /* States.chaseFriend */;
                return;
            }
        }
        var frameResult = this.currentState.nextFrame();
        if (frameResult === states_1.FrameResult.stateComplete) {
            // If recovering from swipe..
            if (this.holdState && this.holdStateEnum) {
                this.currentState = this.holdState;
                this.currentStateEnum = this.holdStateEnum;
                this.holdState = undefined;
                this.holdStateEnum = undefined;
                return;
            }
            var nextState = this.chooseNextState(this.currentStateEnum);
            this.currentState = (0, states_1.resolveState)(nextState, this);
            this.currentStateEnum = nextState;
        }
        else if (frameResult === states_1.FrameResult.stateCancel) {
            if (this.currentStateEnum === "chase" /* States.chase */) {
                var nextState = this.chooseNextState("idle-with-ball" /* States.idleWithBall */);
                this.currentState = (0, states_1.resolveState)(nextState, this);
                this.currentStateEnum = nextState;
            }
            else if (this.currentStateEnum === "chase-friend" /* States.chaseFriend */) {
                var nextState = this.chooseNextState("idle-with-ball" /* States.idleWithBall */);
                this.currentState = (0, states_1.resolveState)(nextState, this);
                this.currentStateEnum = nextState;
            }
        }
    }
    get hasFriend() {
        return this._friend !== undefined;
    }
    get friend() {
        return this._friend;
    }
    get name() {
        return this._name;
    }
    makeFriendsWith(friend) {
        this._friend = friend;
        console.log(this.name, ": I'm now friends ❤️ with ", friend.name);
        return true;
    }
    get isPlaying() {
        return (this.isMoving &&
            (this.currentStateEnum === "run-right" /* States.runRight */ ||
                this.currentStateEnum === "run-left" /* States.runLeft */));
    }
    get emoji() {
        return '🐶';
    }
}
exports.BasePetType = BasePetType;


/***/ }),

/***/ "./src/panel/main.ts":
/*!***************************!*\
  !*** ./src/panel/main.ts ***!
  \***************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.allPets = void 0;
const pets_1 = __webpack_require__(/*! ./pets */ "./src/panel/pets.ts");
var Icon = './pawprint.png';
var basePetUri = "../../media/totoro/";
exports.allPets = new pets_1.PetCollection();
// var petCounter: number;
function component() {
    const element = document.createElement('div');
    const cvs = document.createElement('canvas');
    cvs.id = 'petCanvas';
    cvs.width = 150;
    cvs.height = 150;
    element.appendChild(cvs);
    return element;
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
function handleMouseOver(e) {
    var el = e.currentTarget;
    exports.allPets.pets.forEach((element) => {
        if (element.collision === el) {
            if (!element.pet.canSwipe) {
                return;
            }
            element.pet.swipe();
        }
    });
}
function startAnimations(collision, pet) {
    collision.addEventListener('mouseover', handleMouseOver);
    setInterval(() => {
        pet.nextFrame();
    }, 100);
}
function addPetToPanel(petType, basePetUri, petColor, petSize, left, bottom, floor, name) {
    var petSpriteElement = document.createElement('img');
    petSpriteElement.className = 'pet';
    document.getElementById('petsContainer').appendChild(petSpriteElement);
    var collisionElement = document.createElement('div');
    collisionElement.className = 'collision';
    document.getElementById('petsContainer').appendChild(collisionElement);
    var speechBubbleElement = document.createElement('div');
    speechBubbleElement.className = `bubble bubble-${petSize}`;
    speechBubbleElement.innerText = 'Hello!';
    document.getElementById('petsContainer').appendChild(speechBubbleElement);
    const root = basePetUri + '/' + petType + '/' + petColor;
    console.log('Creating new pet : ', petType, root, petColor, petSize, name);
    try {
        if (!(0, pets_1.availableColors)(petType).includes(petColor)) {
            throw new pets_1.InvalidPetException('Invalid color for pet type');
        }
        var newPet = (0, pets_1.createPet)(petType, petSpriteElement, collisionElement, speechBubbleElement, petSize, left, bottom, root, floor, name);
        // petCounter++;
        startAnimations(collisionElement, newPet);
    }
    catch (e) {
        // Remove elements
        petSpriteElement.remove();
        collisionElement.remove();
        speechBubbleElement.remove();
        throw e;
    }
    return new pets_1.PetElement(petSpriteElement, collisionElement, speechBubbleElement, newPet, petColor, petType);
}
document.body.appendChild(component());
// updateCanvas();
addPetToPanel("totoro" /* PetType.totoro */, basePetUri, "gray" /* PetColor.gray */, "small" /* PetSize.small */, 0, 0, 150, "totoro" /* PetType.totoro */);


/***/ }),

/***/ "./src/panel/pets.ts":
/*!***************************!*\
  !*** ./src/panel/pets.ts ***!
  \***************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.normalizeColor = exports.availableColors = exports.createPet = exports.InvalidPetException = exports.PetCollection = exports.PetElement = void 0;
const cat_1 = __webpack_require__(/*! ./pets/cat */ "./src/panel/pets/cat.ts");
const chicken_1 = __webpack_require__(/*! ./pets/chicken */ "./src/panel/pets/chicken.ts");
const clippy_1 = __webpack_require__(/*! ./pets/clippy */ "./src/panel/pets/clippy.ts");
const cockatiel_1 = __webpack_require__(/*! ./pets/cockatiel */ "./src/panel/pets/cockatiel.ts");
const crab_1 = __webpack_require__(/*! ./pets/crab */ "./src/panel/pets/crab.ts");
const dog_1 = __webpack_require__(/*! ./pets/dog */ "./src/panel/pets/dog.ts");
const fox_1 = __webpack_require__(/*! ./pets/fox */ "./src/panel/pets/fox.ts");
const mod_1 = __webpack_require__(/*! ./pets/mod */ "./src/panel/pets/mod.ts");
const rocky_1 = __webpack_require__(/*! ./pets/rocky */ "./src/panel/pets/rocky.ts");
const rubberduck_1 = __webpack_require__(/*! ./pets/rubberduck */ "./src/panel/pets/rubberduck.ts");
const snake_1 = __webpack_require__(/*! ./pets/snake */ "./src/panel/pets/snake.ts");
const totoro_1 = __webpack_require__(/*! ./pets/totoro */ "./src/panel/pets/totoro.ts");
const zappy_1 = __webpack_require__(/*! ./pets/zappy */ "./src/panel/pets/zappy.ts");
const rat_1 = __webpack_require__(/*! ./pets/rat */ "./src/panel/pets/rat.ts");
const turtle_1 = __webpack_require__(/*! ./pets/turtle */ "./src/panel/pets/turtle.ts");
class PetElement {
    el;
    collision;
    speech;
    pet;
    color;
    type;
    remove() {
        this.el.remove();
        this.collision.remove();
        this.speech.remove();
        this.color = "null" /* PetColor.null */;
        this.type = "null" /* PetType.null */;
    }
    constructor(el, collision, speech, pet, color, type) {
        this.el = el;
        this.collision = collision;
        this.speech = speech;
        this.pet = pet;
        this.color = color;
        this.type = type;
    }
}
exports.PetElement = PetElement;
class PetCollection {
    _pets;
    constructor() {
        this._pets = new Array(0);
    }
    get pets() {
        return this._pets;
    }
    push(pet) {
        this._pets.push(pet);
    }
    reset() {
        this._pets.forEach((pet) => {
            pet.remove();
        });
        this._pets = [];
    }
    locate(name) {
        return this._pets.find((collection) => {
            return collection.pet.name === name;
        });
    }
    remove(name) {
        this._pets.forEach((pet) => {
            if (pet.pet.name === name) {
                pet.remove();
            }
        });
        this._pets = this._pets.filter((pet) => {
            return pet.pet.name !== name;
        });
    }
    seekNewFriends() {
        if (this._pets.length <= 1) {
            return [];
        } // You can't be friends with yourself.
        var messages = new Array(0);
        this._pets.forEach((petInCollection) => {
            if (petInCollection.pet.hasFriend) {
                return;
            } // I already have a friend!
            this._pets.forEach((potentialFriend) => {
                if (potentialFriend.pet.hasFriend) {
                    return;
                } // Already has a friend. sorry.
                if (!potentialFriend.pet.canChase) {
                    return;
                } // Pet is busy doing something else.
                if (potentialFriend.pet.left > petInCollection.pet.left &&
                    potentialFriend.pet.left <
                        petInCollection.pet.left + petInCollection.pet.width) {
                    // We found a possible new friend..
                    console.log(petInCollection.pet.name, ' wants to be friends with ', potentialFriend.pet.name, '.');
                    if (petInCollection.pet.makeFriendsWith(potentialFriend.pet)) {
                        potentialFriend.pet.showSpeechBubble('❤️', 2000);
                        petInCollection.pet.showSpeechBubble('❤️', 2000);
                    }
                }
            });
        });
        return messages;
    }
}
exports.PetCollection = PetCollection;
class InvalidPetException {
    message;
    constructor(message) {
        this.message = message;
    }
}
exports.InvalidPetException = InvalidPetException;
function createPet(petType, el, collision, speech, size, left, bottom, petRoot, floor, name) {
    if (name === undefined || name === null || name === '') {
        throw new InvalidPetException('name is undefined');
    }
    const standardPetArguments = [el, collision, speech, size, left, bottom, petRoot, floor, name];
    switch (petType) {
        case "cat" /* PetType.cat */:
            return new cat_1.Cat(...standardPetArguments, 3 /* PetSpeed.normal */);
        case "chicken" /* PetType.chicken */:
            return new chicken_1.Chicken(...standardPetArguments, 3 /* PetSpeed.normal */);
        case "dog" /* PetType.dog */:
            return new dog_1.Dog(...standardPetArguments, 3 /* PetSpeed.normal */);
        case "fox" /* PetType.fox */:
            return new fox_1.Fox(...standardPetArguments, 4 /* PetSpeed.fast */);
        case "crab" /* PetType.crab */:
            return new crab_1.Crab(...standardPetArguments, 2 /* PetSpeed.slow */);
        case "clippy" /* PetType.clippy */:
            return new clippy_1.Clippy(...standardPetArguments, 2 /* PetSpeed.slow */);
        case "mod" /* PetType.mod */:
            return new mod_1.Mod(...standardPetArguments, 3 /* PetSpeed.normal */);
        case "totoro" /* PetType.totoro */:
            return new totoro_1.Totoro(...standardPetArguments, 3 /* PetSpeed.normal */);
        case "snake" /* PetType.snake */:
            return new snake_1.Snake(...standardPetArguments, 1 /* PetSpeed.verySlow */);
        case "rubber-duck" /* PetType.rubberduck */:
            return new rubberduck_1.RubberDuck(...standardPetArguments, 4 /* PetSpeed.fast */);
        case "zappy" /* PetType.zappy */:
            return new zappy_1.Zappy(...standardPetArguments, 5 /* PetSpeed.veryFast */);
        case "rocky" /* PetType.rocky */:
            return new rocky_1.Rocky(...standardPetArguments, 0 /* PetSpeed.still */);
        case "cockatiel" /* PetType.cockatiel */:
            return new cockatiel_1.Cockatiel(...standardPetArguments, 3 /* PetSpeed.normal */);
        case "rat" /* PetType.rat */:
            return new rat_1.Rat(...standardPetArguments, 3 /* PetSpeed.normal */);
        case "turtle" /* PetType.turtle */:
            return new turtle_1.Turtle(...standardPetArguments, 1 /* PetSpeed.verySlow */);
        default:
            throw new InvalidPetException("Pet type doesn't exist");
    }
}
exports.createPet = createPet;
function availableColors(petType) {
    switch (petType) {
        case "cat" /* PetType.cat */:
            return cat_1.Cat.possibleColors;
        case "chicken" /* PetType.chicken */:
            return chicken_1.Chicken.possibleColors;
        case "dog" /* PetType.dog */:
            return dog_1.Dog.possibleColors;
        case "fox" /* PetType.fox */:
            return fox_1.Fox.possibleColors;
        case "crab" /* PetType.crab */:
            return crab_1.Crab.possibleColors;
        case "clippy" /* PetType.clippy */:
            return clippy_1.Clippy.possibleColors;
        case "mod" /* PetType.mod */:
            return mod_1.Mod.possibleColors;
        case "totoro" /* PetType.totoro */:
            return totoro_1.Totoro.possibleColors;
        case "snake" /* PetType.snake */:
            return snake_1.Snake.possibleColors;
        case "rubber-duck" /* PetType.rubberduck */:
            return rubberduck_1.RubberDuck.possibleColors;
        case "zappy" /* PetType.zappy */:
            return zappy_1.Zappy.possibleColors;
        case "rocky" /* PetType.rocky */:
            return rocky_1.Rocky.possibleColors;
        case "cockatiel" /* PetType.cockatiel */:
            return cockatiel_1.Cockatiel.possibleColors;
        case "rat" /* PetType.rat */:
            return rat_1.Rat.possibleColors;
        case "turtle" /* PetType.turtle */:
            return turtle_1.Turtle.possibleColors;
        default:
            throw new InvalidPetException("Pet type doesn't exist");
    }
}
exports.availableColors = availableColors;
/**
 * Some pets can only have certain colors, this makes sure they haven't been misconfigured.
 * @param petColor
 * @param petType
 * @returns normalized color
 */
function normalizeColor(petColor, petType) {
    const colors = availableColors(petType);
    if (colors.includes(petColor)) {
        return petColor;
    }
    else {
        return colors[0];
    }
}
exports.normalizeColor = normalizeColor;


/***/ }),

/***/ "./src/panel/pets/cat.ts":
/*!*******************************!*\
  !*** ./src/panel/pets/cat.ts ***!
  \*******************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.CAT_NAMES = exports.Cat = void 0;
const basepettype_1 = __webpack_require__(/*! ../basepettype */ "./src/panel/basepettype.ts");
class Cat extends basepettype_1.BasePetType {
    label = 'cat';
    static possibleColors = [
        "black" /* PetColor.black */,
        "brown" /* PetColor.brown */,
        "white" /* PetColor.white */,
        "gray" /* PetColor.gray */,
        "lightbrown" /* PetColor.lightbrown */,
    ];
    sequence = {
        startingState: "sit-idle" /* States.sitIdle */,
        sequenceStates: [
            {
                state: "sit-idle" /* States.sitIdle */,
                possibleNextStates: ["walk-right" /* States.walkRight */, "run-right" /* States.runRight */],
            },
            {
                state: "walk-right" /* States.walkRight */,
                possibleNextStates: ["walk-left" /* States.walkLeft */, "run-left" /* States.runLeft */],
            },
            {
                state: "run-right" /* States.runRight */,
                possibleNextStates: ["walk-left" /* States.walkLeft */, "run-left" /* States.runLeft */],
            },
            {
                state: "walk-left" /* States.walkLeft */,
                possibleNextStates: [
                    "sit-idle" /* States.sitIdle */,
                    "climb-wall-left" /* States.climbWallLeft */,
                    "walk-right" /* States.walkRight */,
                    "run-right" /* States.runRight */,
                ],
            },
            {
                state: "run-left" /* States.runLeft */,
                possibleNextStates: [
                    "sit-idle" /* States.sitIdle */,
                    "climb-wall-left" /* States.climbWallLeft */,
                    "walk-right" /* States.walkRight */,
                    "run-right" /* States.runRight */,
                ],
            },
            {
                state: "climb-wall-left" /* States.climbWallLeft */,
                possibleNextStates: ["wall-hang-left" /* States.wallHangLeft */],
            },
            {
                state: "wall-hang-left" /* States.wallHangLeft */,
                possibleNextStates: ["jump-down-left" /* States.jumpDownLeft */],
            },
            {
                state: "jump-down-left" /* States.jumpDownLeft */,
                possibleNextStates: ["land" /* States.land */],
            },
            {
                state: "land" /* States.land */,
                possibleNextStates: [
                    "sit-idle" /* States.sitIdle */,
                    "walk-right" /* States.walkRight */,
                    "run-right" /* States.runRight */,
                ],
            },
            {
                state: "chase" /* States.chase */,
                possibleNextStates: ["idle-with-ball" /* States.idleWithBall */],
            },
            {
                state: "idle-with-ball" /* States.idleWithBall */,
                possibleNextStates: [
                    "walk-right" /* States.walkRight */,
                    "walk-left" /* States.walkLeft */,
                    "run-left" /* States.runLeft */,
                    "run-right" /* States.runRight */,
                ],
            },
        ],
    };
    get emoji() {
        return '🐱';
    }
    get hello() {
        return `brrr... Meow!`;
    }
}
exports.Cat = Cat;
exports.CAT_NAMES = [
    'Bella',
    'Charlie',
    'Molly',
    'Coco',
    'Ruby',
    'Oscar',
    'Lucy',
    'Bailey',
    'Milo',
    'Daisy',
    'Archie',
    'Ollie',
    'Rosie',
    'Lola',
    'Frankie',
    'Roxy',
    'Poppy',
    'Luna',
    'Jack',
    'Millie',
    'Teddy',
    'Cooper',
    'Bear',
    'Rocky',
    'Alfie',
    'Hugo',
    'Bonnie',
    'Pepper',
    'Lily',
    'Tilly',
    'Leo',
    'Maggie',
    'George',
    'Mia',
    'Marley',
    'Harley',
    'Chloe',
    'Lulu',
    'Missy',
    'Jasper',
    'Billy',
    'Nala',
    'Monty',
    'Ziggy',
    'Winston',
    'Zeus',
    'Zoe',
    'Stella',
    'Sasha',
    'Rusty',
    'Gus',
    'Baxter',
    'Dexter',
    'Willow',
    'Barney',
    'Bruno',
    'Penny',
    'Honey',
    'Milly',
    'Murphy',
    'Simba',
    'Holly',
    'Benji',
    'Henry',
    'Lilly',
    'Pippa',
    'Shadow',
    'Sam',
    'Lucky',
    'Ellie',
    'Duke',
    'Jessie',
    'Cookie',
    'Harvey',
    'Bruce',
    'Jax',
    'Rex',
    'Louie',
    'Jet',
    'Banjo',
    'Beau',
    'Ella',
    'Ralph',
    'Loki',
    'Lexi',
    'Chester',
    'Sophie',
    'Chilli',
    'Billie',
    'Louis',
    'Scout',
    'Cleo',
    'Purfect',
    'Spot',
    'Bolt',
    'Julia',
    'Ginger',
    'Daisy',
    'Amelia',
    'Oliver',
    'Ghost',
    'Midnight',
    'Pumpkin',
    'Shadow',
    'Binx',
    'Riley',
    'Lenny',
    'Mango',
    'Alex',
    'Boo',
    'Botas',
    'Romeo',
    'Bob',
    'Clyde',
    'Simon',
    'Mimmo',
    'Carlotta',
    'Felix',
    'Duchess',
];


/***/ }),

/***/ "./src/panel/pets/chicken.ts":
/*!***********************************!*\
  !*** ./src/panel/pets/chicken.ts ***!
  \***********************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.CHICKEN_NAMES = exports.Chicken = void 0;
const basepettype_1 = __webpack_require__(/*! ../basepettype */ "./src/panel/basepettype.ts");
class Chicken extends basepettype_1.BasePetType {
    label = 'chicken';
    static possibleColors = ["white" /* PetColor.white */];
    sequence = {
        startingState: "sit-idle" /* States.sitIdle */,
        sequenceStates: [
            {
                state: "sit-idle" /* States.sitIdle */,
                possibleNextStates: [
                    "walk-right" /* States.walkRight */,
                    "run-right" /* States.runRight */,
                    "swipe" /* States.swipe */,
                ],
            },
            {
                state: "walk-right" /* States.walkRight */,
                possibleNextStates: ["walk-left" /* States.walkLeft */, "run-left" /* States.runLeft */],
            },
            {
                state: "run-right" /* States.runRight */,
                possibleNextStates: ["walk-left" /* States.walkLeft */, "run-left" /* States.runLeft */],
            },
            {
                state: "walk-left" /* States.walkLeft */,
                possibleNextStates: ["sit-idle" /* States.sitIdle */],
            },
            {
                state: "run-left" /* States.runLeft */,
                possibleNextStates: ["sit-idle" /* States.sitIdle */],
            },
            {
                state: "chase" /* States.chase */,
                possibleNextStates: ["idle-with-ball" /* States.idleWithBall */],
            },
            {
                state: "swipe" /* States.swipe */,
                possibleNextStates: ["sit-idle" /* States.sitIdle */],
            },
            {
                state: "idle-with-ball" /* States.idleWithBall */,
                possibleNextStates: [
                    "walk-right" /* States.walkRight */,
                    "walk-left" /* States.walkLeft */,
                    "run-left" /* States.runLeft */,
                    "run-right" /* States.runRight */,
                    "swipe" /* States.swipe */,
                ],
            },
        ],
    };
    get emoji() {
        return '🐔';
    }
    get hello() {
        return ` Puk Puk Pukaaak - just let me lay my egg. 🥚`;
    }
}
exports.Chicken = Chicken;
exports.CHICKEN_NAMES = [
    'Hen Solo',
    'Cluck Vader',
    'Obi Wan Henobi',
    'Albert Eggstein',
    'Abrahen Lincoln',
    'Cluck Norris',
    'Sir Clucks-A-Lot',
    'Frank-hen-stein',
    'Richard',
    'Dixi',
    'Nugget',
    'Bella',
    'Cotton',
    'Pip',
    'Lucky',
    'Polly',
    'Mirabel',
    'Elsa',
    'Bon-Bon',
    'Ruby',
    'Rosie',
    'Teriyaki',
    'Penguin',
    'Sybil',
];


/***/ }),

/***/ "./src/panel/pets/clippy.ts":
/*!**********************************!*\
  !*** ./src/panel/pets/clippy.ts ***!
  \**********************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.CLIPPY_NAMES = exports.Clippy = void 0;
const basepettype_1 = __webpack_require__(/*! ../basepettype */ "./src/panel/basepettype.ts");
class Clippy extends basepettype_1.BasePetType {
    label = 'clippy';
    static possibleColors = [
        "black" /* PetColor.black */,
        "brown" /* PetColor.brown */,
        "green" /* PetColor.green */,
        "yellow" /* PetColor.yellow */,
    ];
    sequence = {
        startingState: "sit-idle" /* States.sitIdle */,
        sequenceStates: [
            {
                state: "sit-idle" /* States.sitIdle */,
                possibleNextStates: ["walk-right" /* States.walkRight */, "run-right" /* States.runRight */],
            },
            {
                state: "walk-right" /* States.walkRight */,
                possibleNextStates: ["walk-left" /* States.walkLeft */, "run-left" /* States.runLeft */],
            },
            {
                state: "run-right" /* States.runRight */,
                possibleNextStates: ["walk-left" /* States.walkLeft */, "run-left" /* States.runLeft */],
            },
            {
                state: "walk-left" /* States.walkLeft */,
                possibleNextStates: ["sit-idle" /* States.sitIdle */],
            },
            {
                state: "run-left" /* States.runLeft */,
                possibleNextStates: ["sit-idle" /* States.sitIdle */],
            },
            {
                state: "chase" /* States.chase */,
                possibleNextStates: ["idle-with-ball" /* States.idleWithBall */],
            },
            {
                state: "idle-with-ball" /* States.idleWithBall */,
                possibleNextStates: [
                    "walk-right" /* States.walkRight */,
                    "walk-left" /* States.walkLeft */,
                    "run-left" /* States.runLeft */,
                    "run-right" /* States.runRight */,
                ],
            },
        ],
    };
    get emoji() {
        return '📎';
    }
    get hello() {
        return ` Hi, I'm Clippy, would you like some assistance today? 👋!`;
    }
}
exports.Clippy = Clippy;
exports.CLIPPY_NAMES = [
    'Clippy',
    'Karl Klammer',
    'Clippy Jr.',
    'Molly',
    'Coco',
    'Buddy',
    'Ruby',
    'Oscar',
    'Lucy',
    'Bailey',
];


/***/ }),

/***/ "./src/panel/pets/cockatiel.ts":
/*!*************************************!*\
  !*** ./src/panel/pets/cockatiel.ts ***!
  \*************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.COCKATIEL_NAMES = exports.Cockatiel = void 0;
const basepettype_1 = __webpack_require__(/*! ../basepettype */ "./src/panel/basepettype.ts");
class Cockatiel extends basepettype_1.BasePetType {
    label = 'cockatiel';
    static possibleColors = ["gray" /* PetColor.gray */];
    sequence = {
        startingState: "sit-idle" /* States.sitIdle */,
        sequenceStates: [
            {
                state: "sit-idle" /* States.sitIdle */,
                possibleNextStates: ["walk-right" /* States.walkRight */, "run-right" /* States.runRight */],
            },
            {
                state: "walk-right" /* States.walkRight */,
                possibleNextStates: ["walk-left" /* States.walkLeft */, "run-left" /* States.runLeft */],
            },
            {
                state: "run-right" /* States.runRight */,
                possibleNextStates: ["walk-left" /* States.walkLeft */, "run-left" /* States.runLeft */],
            },
            {
                state: "walk-left" /* States.walkLeft */,
                possibleNextStates: ["sit-idle" /* States.sitIdle */],
            },
            {
                state: "run-left" /* States.runLeft */,
                possibleNextStates: ["sit-idle" /* States.sitIdle */],
            },
            {
                state: "chase" /* States.chase */,
                possibleNextStates: ["idle-with-ball" /* States.idleWithBall */],
            },
            {
                state: "idle-with-ball" /* States.idleWithBall */,
                possibleNextStates: [
                    "walk-right" /* States.walkRight */,
                    "walk-left" /* States.walkLeft */,
                    "run-left" /* States.runLeft */,
                    "run-right" /* States.runRight */,
                ],
            },
        ],
    };
    get emoji() {
        return '🦜';
    }
    get hello() {
        // TODO: #191 Add a custom message for cockatiel
        return ` Hello, I'm a good bird 👋!`;
    }
}
exports.Cockatiel = Cockatiel;
exports.COCKATIEL_NAMES = [
    'Cocktail',
    'Pipsqueak',
    'Sir Chirps a Lot',
    'Nibbles',
    'Lord of the Wings',
    'Girl Nest Door',
    'Wingman',
    'Meryl Cheep',
    'Jack Sparrow',
    'Godfeather',
    'Mickey',
    'Baquack Obama',
    'Dame Judi Finch',
    'Kanye Nest',
    'Speck',
    'Cheecky',
    'Arthur',
    'Paco',
    'Bobo',
    'Walt',
    'Happy',
    'Junior',
    'Coco',
    'Yoyo',
    'Milo',
    'Skipper',
    'Scarlet',
    'Diva',
    'Ursula',
    'Donna',
    'Lola',
    'Kiko',
    'Luna',
];


/***/ }),

/***/ "./src/panel/pets/crab.ts":
/*!********************************!*\
  !*** ./src/panel/pets/crab.ts ***!
  \********************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.CRAB_NAMES = exports.Crab = void 0;
const basepettype_1 = __webpack_require__(/*! ../basepettype */ "./src/panel/basepettype.ts");
class Crab extends basepettype_1.BasePetType {
    label = 'crab';
    static possibleColors = ["red" /* PetColor.red */];
    sequence = {
        startingState: "sit-idle" /* States.sitIdle */,
        sequenceStates: [
            {
                state: "sit-idle" /* States.sitIdle */,
                possibleNextStates: ["walk-right" /* States.walkRight */, "run-right" /* States.runRight */],
            },
            {
                state: "walk-right" /* States.walkRight */,
                possibleNextStates: ["walk-left" /* States.walkLeft */, "run-left" /* States.runLeft */],
            },
            {
                state: "run-right" /* States.runRight */,
                possibleNextStates: ["walk-left" /* States.walkLeft */, "run-left" /* States.runLeft */],
            },
            {
                state: "walk-left" /* States.walkLeft */,
                possibleNextStates: ["sit-idle" /* States.sitIdle */],
            },
            {
                state: "run-left" /* States.runLeft */,
                possibleNextStates: ["sit-idle" /* States.sitIdle */],
            },
            {
                state: "chase" /* States.chase */,
                possibleNextStates: ["idle-with-ball" /* States.idleWithBall */],
            },
            {
                state: "idle-with-ball" /* States.idleWithBall */,
                possibleNextStates: [
                    "walk-right" /* States.walkRight */,
                    "walk-left" /* States.walkLeft */,
                    "run-left" /* States.runLeft */,
                    "run-right" /* States.runRight */,
                ],
            },
        ],
    };
    get emoji() {
        return '🦀';
    }
    get hello() {
        return ` Hi, I'm Crabsolutely Clawsome Crab 👋!`;
    }
}
exports.Crab = Crab;
exports.CRAB_NAMES = [
    'Ferris',
    'Pinchy',
    'Grabby',
    'Big Red',
    'Crabby',
    'Buddy',
    'Ruby Red',
    'Oscar',
    'Lucy',
    'Bailey',
    'Crabito',
    'Percy',
    'Rocky',
    'Mr. Krabs',
    'Shelly',
    'Santa Claws',
    'Clawdia',
    'Scuttle',
    'Snappy',
    'Hermit',
    'Horseshoe',
    'Snapper',
    'Coconut',
    'Sebastian',
    'Abby',
    'Bubbles',
    'Bait',
    'Big Mac',
    'Biggie',
    'Claws',
    'Copper',
    'Crabette',
    'Crabina',
    'Crabmister',
    'Crusty',
    'Crabcake',
    'Digger',
    'Nipper',
    'Pincer',
    'Poopsie',
    'Recluse',
    'Salty',
    'Squirt',
    'Groucho',
    'Grumpy',
    'Lenny Krabitz',
    'Leonardo DaPinchy',
    'Peeves',
    'Penny Pincher',
    'Prickl',
];


/***/ }),

/***/ "./src/panel/pets/dog.ts":
/*!*******************************!*\
  !*** ./src/panel/pets/dog.ts ***!
  \*******************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.DOG_NAMES = exports.Dog = void 0;
const basepettype_1 = __webpack_require__(/*! ../basepettype */ "./src/panel/basepettype.ts");
class Dog extends basepettype_1.BasePetType {
    label = 'dog';
    static possibleColors = [
        "black" /* PetColor.black */,
        "brown" /* PetColor.brown */,
        "white" /* PetColor.white */,
        "red" /* PetColor.red */,
        "akita" /* PetColor.akita */,
    ];
    sequence = {
        startingState: "sit-idle" /* States.sitIdle */,
        sequenceStates: [
            {
                state: "sit-idle" /* States.sitIdle */,
                possibleNextStates: [
                    "walk-right" /* States.walkRight */,
                    "run-right" /* States.runRight */,
                    "lie" /* States.lie */,
                ],
            },
            {
                state: "lie" /* States.lie */,
                possibleNextStates: ["walk-right" /* States.walkRight */, "run-right" /* States.runRight */],
            },
            {
                state: "walk-right" /* States.walkRight */,
                possibleNextStates: ["walk-left" /* States.walkLeft */, "run-left" /* States.runLeft */],
            },
            {
                state: "run-right" /* States.runRight */,
                possibleNextStates: ["walk-left" /* States.walkLeft */, "run-left" /* States.runLeft */],
            },
            {
                state: "walk-left" /* States.walkLeft */,
                possibleNextStates: [
                    "sit-idle" /* States.sitIdle */,
                    "lie" /* States.lie */,
                    "walk-right" /* States.walkRight */,
                    "run-right" /* States.runRight */,
                ],
            },
            {
                state: "run-left" /* States.runLeft */,
                possibleNextStates: [
                    "sit-idle" /* States.sitIdle */,
                    "lie" /* States.lie */,
                    "walk-right" /* States.walkRight */,
                    "run-right" /* States.runRight */,
                ],
            },
            {
                state: "chase" /* States.chase */,
                possibleNextStates: ["idle-with-ball" /* States.idleWithBall */],
            },
            {
                state: "idle-with-ball" /* States.idleWithBall */,
                possibleNextStates: [
                    "walk-right" /* States.walkRight */,
                    "walk-left" /* States.walkLeft */,
                    "run-left" /* States.runLeft */,
                    "run-right" /* States.runRight */,
                ],
            },
        ],
    };
    get emoji() {
        return '🐶';
    }
    get hello() {
        return ` Every dog has its day - and today is woof day! Today I just want to bark. Take me on a walk`;
    }
}
exports.Dog = Dog;
exports.DOG_NAMES = [
    'Bella',
    'Charlie',
    'Max',
    'Molly',
    'Coco',
    'Buddy',
    'Ruby',
    'Oscar',
    'Lucy',
    'Bailey',
    'Milo',
    'Daisy',
    'Archie',
    'Ollie',
    'Rosie',
    'Lola',
    'Frankie',
    'Toby',
    'Roxy',
    'Poppy',
    'Luna',
    'Jack',
    'Millie',
    'Teddy',
    'Harry',
    'Cooper',
    'Bear',
    'Rocky',
    'Alfie',
    'Hugo',
    'Bonnie',
    'Pepper',
    'Lily',
    'Leo',
    'Maggie',
    'George',
    'Mia',
    'Marley',
    'Harley',
    'Chloe',
    'Lulu',
    'Jasper',
    'Billy',
    'Nala',
    'Monty',
    'Ziggy',
    'Winston',
    'Zeus',
    'Zoe',
    'Stella',
    'Sasha',
    'Rusty',
    'Gus',
    'Baxter',
    'Dexter',
    'Diesel',
    'Willow',
    'Barney',
    'Bruno',
    'Penny',
    'Honey',
    'Milly',
    'Murphy',
    'Holly',
    'Benji',
    'Henry',
    'Lilly',
    'Pippa',
    'Shadow',
    'Sam',
    'Buster',
    'Lucky',
    'Ellie',
    'Duke',
    'Jessie',
    'Cookie',
    'Harvey',
    'Bruce',
    'Jax',
    'Rex',
    'Louie',
    'Bentley',
    'Jet',
    'Banjo',
    'Beau',
    'Ella',
    'Ralph',
    'Loki',
    'Lexi',
    'Chester',
    'Sophie',
    'Billie',
    'Louis',
    'Charlie',
    'Cleo',
    'Spot',
    'Harry',
    'Bolt',
    'Ein',
    'Maddy',
    'Ghost',
    'Midnight',
    'Pumpkin',
    'Shadow',
    'Sparky',
    'Linus',
    'Cody',
    'Slinky',
    'Toto',
    'Balto',
    'Golfo',
    'Pongo',
    'Beethoven',
    'Hachiko',
    'Scooby',
    'Clifford',
    'Astro',
    'Goofy',
    'Chip',
    'Einstein',
    'Fang',
    'Truman',
    'Uggie',
    'Bingo',
    'Blue',
    'Cometa',
    'Krypto',
    'Huesos',
    'Odie',
    'Snoopy',
    'Aisha',
    'Moly',
    'Chiquita',
    'Chavela',
    'Tramp',
    'Lady',
    'Puddles',
];


/***/ }),

/***/ "./src/panel/pets/fox.ts":
/*!*******************************!*\
  !*** ./src/panel/pets/fox.ts ***!
  \*******************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.FOX_NAMES = exports.Fox = void 0;
const basepettype_1 = __webpack_require__(/*! ../basepettype */ "./src/panel/basepettype.ts");
class Fox extends basepettype_1.BasePetType {
    label = 'fox';
    static possibleColors = ["red" /* PetColor.red */, "white" /* PetColor.white */];
    sequence = {
        startingState: "sit-idle" /* States.sitIdle */,
        sequenceStates: [
            {
                state: "sit-idle" /* States.sitIdle */,
                possibleNextStates: [
                    "lie" /* States.lie */,
                    "walk-right" /* States.walkRight */,
                    "walk-left" /* States.walkLeft */,
                    "run-right" /* States.runRight */,
                    "run-left" /* States.runLeft */,
                ],
            },
            {
                state: "lie" /* States.lie */,
                possibleNextStates: [
                    "walk-right" /* States.walkRight */,
                    "walk-left" /* States.walkLeft */,
                    "run-right" /* States.runRight */,
                    "run-left" /* States.runLeft */,
                ],
            },
            {
                state: "walk-right" /* States.walkRight */,
                possibleNextStates: [
                    "sit-idle" /* States.sitIdle */,
                    "walk-left" /* States.walkLeft */,
                    "run-left" /* States.runLeft */,
                ],
            },
            {
                state: "walk-left" /* States.walkLeft */,
                possibleNextStates: [
                    "sit-idle" /* States.sitIdle */,
                    "walk-right" /* States.walkRight */,
                    "run-right" /* States.runRight */,
                ],
            },
            {
                state: "run-right" /* States.runRight */,
                possibleNextStates: [
                    "lie" /* States.lie */,
                    "sit-idle" /* States.sitIdle */,
                    "walk-left" /* States.walkLeft */,
                    "run-left" /* States.runLeft */,
                ],
            },
            {
                state: "run-left" /* States.runLeft */,
                possibleNextStates: [
                    "lie" /* States.lie */,
                    "sit-idle" /* States.sitIdle */,
                    "walk-right" /* States.walkRight */,
                    "run-right" /* States.runRight */,
                ],
            },
            {
                state: "chase" /* States.chase */,
                possibleNextStates: ["idle-with-ball" /* States.idleWithBall */],
            },
            {
                state: "idle-with-ball" /* States.idleWithBall */,
                possibleNextStates: [
                    "lie" /* States.lie */,
                    "walk-right" /* States.walkRight */,
                    "walk-left" /* States.walkLeft */,
                    "run-right" /* States.runRight */,
                    "run-left" /* States.runLeft */,
                ],
            },
        ],
    };
    get emoji() {
        return '🦊';
    }
    get hello() {
        return `fox says hello`;
    }
}
exports.Fox = Fox;
exports.FOX_NAMES = [
    'Arizona',
    'Frankie',
    'Rosy',
    'Cinnamon',
    'Ginger',
    'Todd',
    'Rocky',
    'Felix',
    'Sandy',
    'Archie',
    'Flynn',
    'Foxy',
    'Elmo',
    'Ember',
    'Hunter',
    'Otto',
    'Sonic',
    'Amber',
    'Maroon',
    'Spark',
    'Sparky',
    'Sly',
    'Scout',
    'Penny',
    'Ash',
    'Rose',
    'Apollo',
    'Chili',
    'Blaze',
    'Radish',
    'Scarlett',
    'Juliet',
    'Goldie',
    'Rooney',
    'Paprika',
    'Alpine',
    'Rusty',
    'Maple',
    'Vixen',
    'David',
    'Apricot',
    'Claire',
    'Wilma',
    'Copper',
    'Pepper',
    'Crimson',
    'Ariel',
    'Arvi',
    'George',
    'Eva',
    'Fuzzy',
    'Russell',
    'Rufus',
    'Mystic',
    'Leopold',
    'Scully',
    'Ferris',
    'Robin',
    'Zorro',
    'Scarlet',
    'Comet',
    'Rowan',
    'Jake',
    'Hope',
    'Molly',
    'Mars',
    'Apple',
    'Geneva',
    'Redford',
    'Chestnut',
    'Evelyn',
    'Red',
    'Aurora',
    'Agniya',
    'Fitz',
    'Crispin',
    'Sunny',
    'Autumn',
    'Bridget',
    'Ruby',
    'Iris',
    'Pumpkin',
    'Rose',
    'Rosie',
    'Vesta',
    'Adolf',
    'Lava',
    'Conan',
    'Flame',
    'Oswald',
    'Tails',
    'Chester',
    'Jasper',
    'Finch',
    'Scarlet',
    'Chewy',
    'Finnick',
    'Biscuit',
    'Prince Harry',
    'Loki',
    'Pip',
    'Pippin',
];


/***/ }),

/***/ "./src/panel/pets/mod.ts":
/*!*******************************!*\
  !*** ./src/panel/pets/mod.ts ***!
  \*******************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.MOD_NAMES = exports.Mod = void 0;
const basepettype_1 = __webpack_require__(/*! ../basepettype */ "./src/panel/basepettype.ts");
class Mod extends basepettype_1.BasePetType {
    label = 'mod';
    static possibleColors = ["purple" /* PetColor.purple */];
    sequence = {
        startingState: "sit-idle" /* States.sitIdle */,
        sequenceStates: [
            {
                state: "sit-idle" /* States.sitIdle */,
                possibleNextStates: ["walk-right" /* States.walkRight */, "run-right" /* States.runRight */],
            },
            {
                state: "walk-right" /* States.walkRight */,
                possibleNextStates: ["walk-left" /* States.walkLeft */, "run-left" /* States.runLeft */],
            },
            {
                state: "run-right" /* States.runRight */,
                possibleNextStates: ["walk-left" /* States.walkLeft */, "run-left" /* States.runLeft */],
            },
            {
                state: "walk-left" /* States.walkLeft */,
                possibleNextStates: ["sit-idle" /* States.sitIdle */],
            },
            {
                state: "run-left" /* States.runLeft */,
                possibleNextStates: ["sit-idle" /* States.sitIdle */],
            },
            {
                state: "chase" /* States.chase */,
                possibleNextStates: ["idle-with-ball" /* States.idleWithBall */],
            },
            {
                state: "idle-with-ball" /* States.idleWithBall */,
                possibleNextStates: [
                    "walk-right" /* States.walkRight */,
                    "walk-left" /* States.walkLeft */,
                    "run-left" /* States.runLeft */,
                    "run-right" /* States.runRight */,
                ],
            },
        ],
    };
    get emoji() {
        return '🤖';
    }
    get hello() {
        return ` Hi, I'm Mod the dotnet bot, what are you building today?`;
    }
}
exports.Mod = Mod;
exports.MOD_NAMES = [
    'Mod',
    'Moddy',
    'Dotnetbot',
    'Bot',
    'Purple Pal',
    'Ro Bot',
];


/***/ }),

/***/ "./src/panel/pets/rat.ts":
/*!*******************************!*\
  !*** ./src/panel/pets/rat.ts ***!
  \*******************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.RAT_NAMES = exports.Rat = void 0;
const basepettype_1 = __webpack_require__(/*! ../basepettype */ "./src/panel/basepettype.ts");
class Rat extends basepettype_1.BasePetType {
    label = 'rat';
    static possibleColors = ["gray" /* PetColor.gray */, "white" /* PetColor.white */, "brown" /* PetColor.brown */];
    sequence = {
        startingState: "sit-idle" /* States.sitIdle */,
        sequenceStates: [
            {
                state: "sit-idle" /* States.sitIdle */,
                possibleNextStates: ["walk-right" /* States.walkRight */, "run-right" /* States.runRight */],
            },
            {
                state: "walk-right" /* States.walkRight */,
                possibleNextStates: ["walk-left" /* States.walkLeft */, "run-left" /* States.runLeft */],
            },
            {
                state: "run-right" /* States.runRight */,
                possibleNextStates: ["walk-left" /* States.walkLeft */, "run-left" /* States.runLeft */],
            },
            {
                state: "walk-left" /* States.walkLeft */,
                possibleNextStates: [
                    "sit-idle" /* States.sitIdle */,
                    "walk-right" /* States.walkRight */,
                    "run-right" /* States.runRight */,
                ],
            },
            {
                state: "run-left" /* States.runLeft */,
                possibleNextStates: [
                    "sit-idle" /* States.sitIdle */,
                    "walk-right" /* States.walkRight */,
                    "run-right" /* States.runRight */,
                ],
            },
            {
                state: "chase" /* States.chase */,
                possibleNextStates: ["idle-with-ball" /* States.idleWithBall */],
            },
            {
                state: "idle-with-ball" /* States.idleWithBall */,
                possibleNextStates: [
                    "walk-right" /* States.walkRight */,
                    "walk-left" /* States.walkLeft */,
                    "run-left" /* States.runLeft */,
                    "run-right" /* States.runRight */,
                ],
            },
        ],
    };
    get emoji() {
        return '🐀';
    }
    get hello() {
        return `Rat noises...`;
    }
}
exports.Rat = Rat;
exports.RAT_NAMES = [
    'Molly',
    'Coco',
    'Ruby',
    'Lucy',
    'Milo',
    'Daisy',
    'Archie',
    'Ollie',
    'Rosie',
    'Lola',
    'Frankie',
    'Roxy',
    'Poppy',
    'Luna',
    'Millie',
    'Rocky',
    'Alfie',
    'Hugo',
    'Pepper',
    'Lily',
    'Tilly',
    'Leo',
    'Maggie',
    'Mia',
    'Chloe',
    'Lulu',
    'Missy',
    'Jasper',
    'Billy',
    'Nala',
    'Ziggy',
    'Zoe',
    'Penny',
    'Milly',
    'Holly',
    'Henry',
    'Lilly',
    'Pippa',
    'Shadow',
    'Lucky',
    'Duke',
    'Jessie',
    'Cookie',
    'Bruce',
    'Jax',
    'Rex',
    'Louie',
    'Jet',
    'Banjo',
    'Beau',
    'Ella',
    'Ralph',
    'Loki',
    'Lexi',
    'Chilli',
    'Billie',
    'Louis',
    'Scout',
    'Cleo',
    'Spot',
    'Bolt',
    'Ginger',
    'Daisy',
    'Amelia',
    'Oliver',
    'Ghost',
    'Midnight',
    'Pumpkin',
    'Shadow',
    'Binx',
    'Riley',
    'Lenny',
    'Mango',
    'Boo',
    'Botas',
    'Romeo',
    'Simon',
    'Mimmo',
    'Carlotta',
    'Felix',
    'Duchess',
    'Walter',
    'Jesse',
    'Hank',
    'Gus',
    'Mike',
    'Saul',
    'Hector',
    'Tuco',
    'Jupiter',
    'Venus',
    'Apollo',
    'Alexandrite',
    'Amazonite',
    'Flint',
    'Jett',
    'Kyanite',
    'Mica',
    'Micah',
];


/***/ }),

/***/ "./src/panel/pets/rocky.ts":
/*!*********************************!*\
  !*** ./src/panel/pets/rocky.ts ***!
  \*********************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ROCKY_NAMES = exports.Rocky = void 0;
const basepettype_1 = __webpack_require__(/*! ../basepettype */ "./src/panel/basepettype.ts");
class Rocky extends basepettype_1.BasePetType {
    label = 'rocky';
    static possibleColors = ["gray" /* PetColor.gray */];
    sequence = {
        startingState: "sit-idle" /* States.sitIdle */,
        sequenceStates: [
            {
                state: "sit-idle" /* States.sitIdle */,
                possibleNextStates: ["walk-right" /* States.walkRight */, "run-right" /* States.runRight */],
            },
            {
                state: "walk-right" /* States.walkRight */,
                possibleNextStates: ["sit-idle" /* States.sitIdle */, "run-right" /* States.runRight */],
            },
            {
                state: "run-right" /* States.runRight */,
                possibleNextStates: ["sit-idle" /* States.sitIdle */, "walk-right" /* States.walkRight */],
            },
        ],
    };
    get emoji() {
        return '💎';
    }
    get canChase() {
        return false;
    }
    get hello() {
        return ` 👋 I'm rock! I always Rock`;
    }
}
exports.Rocky = Rocky;
exports.ROCKY_NAMES = [
    'Rocky',
    'The Rock',
    'Quartzy',
    'Rocky I',
    'Rocky II',
    'Rocky III',
    'Pebbles Sr.',
    'Big Granite',
    'Boulder',
    'Rockefeller',
    'Pebble',
    'Rocksanne',
    'Rockstar',
    'Onix',
    'Rock and Roll',
    'Dolomite',
    'Granite',
    'Miss Marble',
    'Rock On',
    'Amberstone',
    'Rock With Me',
    'Rock On It',
    'Rock Out',
];


/***/ }),

/***/ "./src/panel/pets/rubberduck.ts":
/*!**************************************!*\
  !*** ./src/panel/pets/rubberduck.ts ***!
  \**************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.DUCK_NAMES = exports.RubberDuck = void 0;
const basepettype_1 = __webpack_require__(/*! ../basepettype */ "./src/panel/basepettype.ts");
class RubberDuck extends basepettype_1.BasePetType {
    label = 'rubber-duck';
    static possibleColors = ["yellow" /* PetColor.yellow */];
    sequence = {
        startingState: "sit-idle" /* States.sitIdle */,
        sequenceStates: [
            {
                state: "sit-idle" /* States.sitIdle */,
                possibleNextStates: ["walk-right" /* States.walkRight */, "run-right" /* States.runRight */],
            },
            {
                state: "walk-right" /* States.walkRight */,
                possibleNextStates: ["walk-left" /* States.walkLeft */, "run-left" /* States.runLeft */],
            },
            {
                state: "run-right" /* States.runRight */,
                possibleNextStates: ["walk-left" /* States.walkLeft */, "run-left" /* States.runLeft */],
            },
            {
                state: "walk-left" /* States.walkLeft */,
                possibleNextStates: ["sit-idle" /* States.sitIdle */],
            },
            {
                state: "run-left" /* States.runLeft */,
                possibleNextStates: ["sit-idle" /* States.sitIdle */],
            },
            {
                state: "chase" /* States.chase */,
                possibleNextStates: ["idle-with-ball" /* States.idleWithBall */],
            },
            {
                state: "idle-with-ball" /* States.idleWithBall */,
                possibleNextStates: [
                    "walk-right" /* States.walkRight */,
                    "walk-left" /* States.walkLeft */,
                    "run-left" /* States.runLeft */,
                    "run-right" /* States.runRight */,
                ],
            },
        ],
    };
    get emoji() {
        return '🐥';
    }
    get hello() {
        return ` Hi, I love to quack around 👋!`;
    }
}
exports.RubberDuck = RubberDuck;
exports.DUCK_NAMES = [
    'Quacky',
    'Floaty',
    'Duck',
    'Molly',
    'Sunshine',
    'Buddy',
    'Chirpy',
    'Oscar',
    'Lucy',
    'Bailey',
    'Beaky',
    'Jemima',
    'Peaches',
    'Quackers',
    'Jelly Beans',
    'Donald',
    'Chady',
    'Waddles',
    'Bill',
    'Bubbles',
    'James Pond',
    'Moby Duck',
    'Quack Sparrow',
    'Peanut',
    'Psyduck',
    'Mr Quack',
    'Louie',
    'Golduck',
    'Daisy',
    'Pickles',
    'Ducky Duck',
    'Mrs Fluffs',
    'Squeek',
    'Ace',
    'Rubberduck',
    'Mrs Beak',
    'April',
    'Tutu',
    'Billy the duck',
    'Ducky',
    'Neco',
    'Dodo',
    'Colonel',
    'Franklin',
    'Emmett',
    'Bubba',
    'Dillard',
    'Duncan',
    'Pogo',
    'Uno',
    'Peanut',
    'Nero',
    'Mowgli',
    'Eggspresso',
    'Webster',
    'Quacker Jack',
    'Plucker',
    'Meeko',
];


/***/ }),

/***/ "./src/panel/pets/snake.ts":
/*!*********************************!*\
  !*** ./src/panel/pets/snake.ts ***!
  \*********************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.SNAKE_NAMES = exports.Snake = void 0;
const basepettype_1 = __webpack_require__(/*! ../basepettype */ "./src/panel/basepettype.ts");
class Snake extends basepettype_1.BasePetType {
    label = 'snake';
    static possibleColors = ["green" /* PetColor.green */];
    sequence = {
        startingState: "sit-idle" /* States.sitIdle */,
        sequenceStates: [
            {
                state: "sit-idle" /* States.sitIdle */,
                possibleNextStates: ["walk-right" /* States.walkRight */, "run-right" /* States.runRight */],
            },
            {
                state: "walk-right" /* States.walkRight */,
                possibleNextStates: ["walk-left" /* States.walkLeft */, "run-left" /* States.runLeft */],
            },
            {
                state: "run-right" /* States.runRight */,
                possibleNextStates: ["walk-left" /* States.walkLeft */, "run-left" /* States.runLeft */],
            },
            {
                state: "walk-left" /* States.walkLeft */,
                possibleNextStates: [
                    "sit-idle" /* States.sitIdle */,
                    "walk-right" /* States.walkRight */,
                    "run-right" /* States.runRight */,
                ],
            },
            {
                state: "run-left" /* States.runLeft */,
                possibleNextStates: [
                    "sit-idle" /* States.sitIdle */,
                    "walk-right" /* States.walkRight */,
                    "run-right" /* States.runRight */,
                ],
            },
            {
                state: "chase" /* States.chase */,
                possibleNextStates: ["idle-with-ball" /* States.idleWithBall */],
            },
            {
                state: "idle-with-ball" /* States.idleWithBall */,
                possibleNextStates: [
                    "walk-right" /* States.walkRight */,
                    "walk-left" /* States.walkLeft */,
                    "run-left" /* States.runLeft */,
                    "run-right" /* States.runRight */,
                ],
            },
        ],
    };
    get emoji() {
        return '🐍';
    }
    get hello() {
        return `Sss... Oh. Oh my gosh! I'm a snake!`;
    }
}
exports.Snake = Snake;
exports.SNAKE_NAMES = [
    'Sneaky',
    'Mr Slippery',
    'Hissy Elliott',
    'Molly',
    'Coco',
    'Buddy',
    'Ruby',
    'Bailey',
    'Max',
    'Seb',
    'Kaa',
    'Mr Hiss',
    'Miss Hiss',
    'Snaku',
    'Kaa',
    'Madame Snake',
    'Sir Hiss',
    'Loki',
    'Steelix',
    'Gyarados',
    'Seviper',
    'Ekanes',
    'Arbok',
    'Snivy',
    'Servine',
    'Serperior',
    'Mojo',
    'Moss',
    'Nigel',
    'Tootsie',
    'Sammy',
    'Ziggy',
    'Asmodeus',
    'Attila',
    'Basil',
    'Diablo',
    'Eden',
    'Eve',
    'Heaven',
    'Hydra',
    'Indiana',
    'Jafaar',
    'Kaa',
    'Medusa',
    'Naga',
    'Severus',
    'Slytherin',
    'Snape',
    'Raven',
    'Slider',
    'Slinky',
    'Stripes',
];


/***/ }),

/***/ "./src/panel/pets/totoro.ts":
/*!**********************************!*\
  !*** ./src/panel/pets/totoro.ts ***!
  \**********************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.TOTORO_NAMES = exports.Totoro = void 0;
const basepettype_1 = __webpack_require__(/*! ../basepettype */ "./src/panel/basepettype.ts");
class Totoro extends basepettype_1.BasePetType {
    label = 'totoro';
    static possibleColors = ["gray" /* PetColor.gray */];
    sequence = {
        startingState: "sit-idle" /* States.sitIdle */,
        sequenceStates: [
            {
                state: "sit-idle" /* States.sitIdle */,
                possibleNextStates: ["walk-right" /* States.walkRight */, "lie" /* States.lie */],
            },
            {
                state: "lie" /* States.lie */,
                possibleNextStates: ["walk-right" /* States.walkRight */, "walk-left" /* States.walkLeft */],
            },
            {
                state: "walk-right" /* States.walkRight */,
                possibleNextStates: ["walk-left" /* States.walkLeft */, "sit-idle" /* States.sitIdle */],
            },
            {
                state: "walk-left" /* States.walkLeft */,
                possibleNextStates: [
                    "sit-idle" /* States.sitIdle */,
                    "climb-wall-left" /* States.climbWallLeft */,
                    "sit-idle" /* States.sitIdle */,
                ],
            },
            {
                state: "climb-wall-left" /* States.climbWallLeft */,
                possibleNextStates: ["wall-hang-left" /* States.wallHangLeft */],
            },
            {
                state: "wall-hang-left" /* States.wallHangLeft */,
                possibleNextStates: ["jump-down-left" /* States.jumpDownLeft */],
            },
            {
                state: "jump-down-left" /* States.jumpDownLeft */,
                possibleNextStates: ["land" /* States.land */],
            },
            {
                state: "land" /* States.land */,
                possibleNextStates: [
                    "sit-idle" /* States.sitIdle */,
                    "walk-right" /* States.walkRight */,
                    "lie" /* States.lie */,
                ],
            },
            {
                state: "chase" /* States.chase */,
                possibleNextStates: ["idle-with-ball" /* States.idleWithBall */],
            },
            {
                state: "idle-with-ball" /* States.idleWithBall */,
                possibleNextStates: ["walk-right" /* States.walkRight */, "walk-left" /* States.walkLeft */],
            },
        ],
    };
    get emoji() {
        return '🐾';
    }
    get hello() {
        return `Try Laughing. Then Whatever Scares You Will Go Away. 🎭`;
    }
}
exports.Totoro = Totoro;
exports.TOTORO_NAMES = [
    'Totoro',
    'トトロ',
    'Max',
    'Molly',
    'Coco',
    'Buddy',
    'Ruby',
    'Oscar',
    'Lucy',
    'Bailey',
    'Big fella',
];


/***/ }),

/***/ "./src/panel/pets/turtle.ts":
/*!**********************************!*\
  !*** ./src/panel/pets/turtle.ts ***!
  \**********************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.TURTLE_NAMES = exports.Turtle = void 0;
const basepettype_1 = __webpack_require__(/*! ../basepettype */ "./src/panel/basepettype.ts");
class Turtle extends basepettype_1.BasePetType {
    label = 'turtle';
    static possibleColors = ["green" /* PetColor.green */, "orange" /* PetColor.orange */];
    sequence = {
        startingState: "sit-idle" /* States.sitIdle */,
        sequenceStates: [
            {
                state: "sit-idle" /* States.sitIdle */,
                possibleNextStates: [
                    "walk-right" /* States.walkRight */,
                    "run-right" /* States.runRight */,
                    "lie" /* States.lie */,
                ],
            },
            {
                state: "lie" /* States.lie */,
                possibleNextStates: ["walk-right" /* States.walkRight */, "run-right" /* States.runRight */],
            },
            {
                state: "walk-right" /* States.walkRight */,
                possibleNextStates: ["walk-left" /* States.walkLeft */, "run-left" /* States.runLeft */],
            },
            {
                state: "run-right" /* States.runRight */,
                possibleNextStates: ["walk-left" /* States.walkLeft */, "run-left" /* States.runLeft */],
            },
            {
                state: "walk-left" /* States.walkLeft */,
                possibleNextStates: [
                    "sit-idle" /* States.sitIdle */,
                    "lie" /* States.lie */,
                    "walk-right" /* States.walkRight */,
                    "run-right" /* States.runRight */,
                ],
            },
            {
                state: "run-left" /* States.runLeft */,
                possibleNextStates: [
                    "sit-idle" /* States.sitIdle */,
                    "lie" /* States.lie */,
                    "walk-right" /* States.walkRight */,
                    "run-right" /* States.runRight */,
                ],
            },
            {
                state: "chase" /* States.chase */,
                possibleNextStates: ["idle-with-ball" /* States.idleWithBall */],
            },
            {
                state: "idle-with-ball" /* States.idleWithBall */,
                possibleNextStates: [
                    "walk-right" /* States.walkRight */,
                    "walk-left" /* States.walkLeft */,
                    "run-left" /* States.runLeft */,
                    "run-right" /* States.runRight */,
                ],
            },
        ],
    };
    get emoji() {
        return '🐢';
    }
    get hello() {
        return ` Slow and steady wins the race!`;
    }
}
exports.Turtle = Turtle;
exports.TURTLE_NAMES = [
    'Shelldon',
    'Shelly',
    'Shelley',
    'Sheldon',
    'Tortuga',
    'Tortellini',
    'Charlie',
    'Ross',
    'Squirt',
    'Crush',
    'Squirtle',
    'Koopa',
    'Bowser',
    'Bowsette',
    'Franklin',
    'Koopa Troopa',
    'Blastoise',
    'Cecil',
    'Wartortle',
    'Donatello',
    'Michaelangelo',
    'Leonardo',
    'Leo',
    'Donny',
    'Mikey',
    'Raphael',
    'Chelone',
    'Emily',
    'Joseph',
    'Anne',
    'Zagreus',
    'Kratos',
    'Atreus',
    'Loki',
    'Freya',
    'Brevity',
    'Arthur',
    'Doyle',
    'Sherlock',
    'Charli',
];


/***/ }),

/***/ "./src/panel/pets/zappy.ts":
/*!*********************************!*\
  !*** ./src/panel/pets/zappy.ts ***!
  \*********************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ZAPPY_NAMES = exports.Zappy = void 0;
const basepettype_1 = __webpack_require__(/*! ../basepettype */ "./src/panel/basepettype.ts");
class Zappy extends basepettype_1.BasePetType {
    label = 'zappy';
    static possibleColors = ["yellow" /* PetColor.yellow */];
    sequence = {
        startingState: "sit-idle" /* States.sitIdle */,
        sequenceStates: [
            {
                state: "sit-idle" /* States.sitIdle */,
                possibleNextStates: ["walk-right" /* States.walkRight */, "run-right" /* States.runRight */],
            },
            {
                state: "walk-right" /* States.walkRight */,
                possibleNextStates: ["walk-left" /* States.walkLeft */, "run-left" /* States.runLeft */],
            },
            {
                state: "run-right" /* States.runRight */,
                possibleNextStates: ["walk-left" /* States.walkLeft */, "run-left" /* States.runLeft */],
            },
            {
                state: "walk-left" /* States.walkLeft */,
                possibleNextStates: ["sit-idle" /* States.sitIdle */],
            },
            {
                state: "run-left" /* States.runLeft */,
                possibleNextStates: ["sit-idle" /* States.sitIdle */],
            },
            {
                state: "chase" /* States.chase */,
                possibleNextStates: ["idle-with-ball" /* States.idleWithBall */],
            },
            {
                state: "idle-with-ball" /* States.idleWithBall */,
                possibleNextStates: [
                    "walk-right" /* States.walkRight */,
                    "walk-left" /* States.walkLeft */,
                    "run-left" /* States.runLeft */,
                    "run-right" /* States.runRight */,
                ],
            },
        ],
    };
    get emoji() {
        return '⚡';
    }
    get hello() {
        // TODO: #193 Add a custom message for zappy
        return ` Hello this is Zappy! Do I look familiar?? I am the mascot for Azure Functions😉`;
    }
}
exports.Zappy = Zappy;
exports.ZAPPY_NAMES = [
    'Zappy',
    'Zippy',
    'Zappy Jr.',
    'Zoppy',
    'Zuppy',
    'Zeppy',
    'Big Z',
    'Little z',
    'The Flash',
    'Thor',
    'Electric Bolt',
    'Azula',
    'Lightning Bolt',
    'Power',
    'Sonic',
    'Speedy',
    'Rush',
];


/***/ }),

/***/ "./src/panel/states.ts":
/*!*****************************!*\
  !*** ./src/panel/states.ts ***!
  \*****************************/
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.JumpDownLeftState = exports.ClimbWallLeftState = exports.ChaseFriendState = exports.ChaseState = exports.RunLeftState = exports.RunRightState = exports.WalkLeftState = exports.WalkRightState = exports.IdleWithBallState = exports.SwipeState = exports.LandState = exports.WallHangLeftState = exports.LieState = exports.SitIdleState = exports.resolveState = exports.isStateAboveGround = exports.BallState = exports.FrameResult = exports.HorizontalDirection = exports.PetPanelState = exports.PetElementState = exports.PetInstanceState = void 0;
class PetInstanceState {
    currentStateEnum;
}
exports.PetInstanceState = PetInstanceState;
class PetElementState {
    petState;
    petType;
    petColor;
    elLeft;
    elBottom;
    petName;
    petFriend;
}
exports.PetElementState = PetElementState;
class PetPanelState {
    petStates;
    petCounter;
}
exports.PetPanelState = PetPanelState;
var HorizontalDirection;
(function (HorizontalDirection) {
    HorizontalDirection[HorizontalDirection["left"] = 0] = "left";
    HorizontalDirection[HorizontalDirection["right"] = 1] = "right";
    HorizontalDirection[HorizontalDirection["natural"] = 2] = "natural";
})(HorizontalDirection || (exports.HorizontalDirection = HorizontalDirection = {}));
var FrameResult;
(function (FrameResult) {
    FrameResult[FrameResult["stateContinue"] = 0] = "stateContinue";
    FrameResult[FrameResult["stateComplete"] = 1] = "stateComplete";
    // Special states
    FrameResult[FrameResult["stateCancel"] = 2] = "stateCancel";
})(FrameResult || (exports.FrameResult = FrameResult = {}));
class BallState {
    cx;
    cy;
    vx;
    vy;
    paused;
    constructor(cx, cy, vx, vy) {
        this.cx = cx;
        this.cy = cy;
        this.vx = vx;
        this.vy = vy;
        this.paused = false;
    }
}
exports.BallState = BallState;
function isStateAboveGround(state) {
    return (state === "climb-wall-left" /* States.climbWallLeft */ ||
        state === "jump-down-left" /* States.jumpDownLeft */ ||
        state === "land" /* States.land */ ||
        state === "wall-hang-left" /* States.wallHangLeft */);
}
exports.isStateAboveGround = isStateAboveGround;
function resolveState(state, pet) {
    switch (state) {
        case "sit-idle" /* States.sitIdle */:
            return new SitIdleState(pet);
        case "walk-right" /* States.walkRight */:
            return new WalkRightState(pet);
        case "walk-left" /* States.walkLeft */:
            return new WalkLeftState(pet);
        case "run-right" /* States.runRight */:
            return new RunRightState(pet);
        case "run-left" /* States.runLeft */:
            return new RunLeftState(pet);
        case "lie" /* States.lie */:
            return new LieState(pet);
        case "wall-hang-left" /* States.wallHangLeft */:
            return new WallHangLeftState(pet);
        case "climb-wall-left" /* States.climbWallLeft */:
            return new ClimbWallLeftState(pet);
        case "jump-down-left" /* States.jumpDownLeft */:
            return new JumpDownLeftState(pet);
        case "land" /* States.land */:
            return new LandState(pet);
        case "swipe" /* States.swipe */:
            return new SwipeState(pet);
        case "idle-with-ball" /* States.idleWithBall */:
            return new IdleWithBallState(pet);
        case "chase-friend" /* States.chaseFriend */:
            return new ChaseFriendState(pet);
    }
    return new SitIdleState(pet);
}
exports.resolveState = resolveState;
class AbstractStaticState {
    label = "sit-idle" /* States.sitIdle */;
    idleCounter;
    spriteLabel = 'idle';
    holdTime = 50;
    pet;
    horizontalDirection = HorizontalDirection.left;
    constructor(pet) {
        this.idleCounter = 0;
        this.pet = pet;
    }
    nextFrame() {
        this.idleCounter++;
        if (this.idleCounter > this.holdTime) {
            return FrameResult.stateComplete;
        }
        return FrameResult.stateContinue;
    }
}
class SitIdleState extends AbstractStaticState {
    label = "sit-idle" /* States.sitIdle */;
    spriteLabel = 'idle';
    horizontalDirection = HorizontalDirection.right;
    holdTime = 50;
}
exports.SitIdleState = SitIdleState;
class LieState extends AbstractStaticState {
    label = "lie" /* States.lie */;
    spriteLabel = 'lie';
    horizontalDirection = HorizontalDirection.right;
    holdTime = 50;
}
exports.LieState = LieState;
class WallHangLeftState extends AbstractStaticState {
    label = "wall-hang-left" /* States.wallHangLeft */;
    spriteLabel = 'wallgrab';
    horizontalDirection = HorizontalDirection.left;
    holdTime = 50;
}
exports.WallHangLeftState = WallHangLeftState;
class LandState extends AbstractStaticState {
    label = "land" /* States.land */;
    spriteLabel = 'land';
    horizontalDirection = HorizontalDirection.left;
    holdTime = 10;
}
exports.LandState = LandState;
class SwipeState extends AbstractStaticState {
    label = "swipe" /* States.swipe */;
    spriteLabel = 'swipe';
    horizontalDirection = HorizontalDirection.natural;
    holdTime = 15;
}
exports.SwipeState = SwipeState;
class IdleWithBallState extends AbstractStaticState {
    label = "idle-with-ball" /* States.idleWithBall */;
    spriteLabel = 'with_ball';
    horizontalDirection = HorizontalDirection.left;
    holdTime = 30;
}
exports.IdleWithBallState = IdleWithBallState;
class WalkRightState {
    label = "walk-right" /* States.walkRight */;
    pet;
    spriteLabel = 'walk';
    horizontalDirection = HorizontalDirection.right;
    leftBoundary;
    speedMultiplier = 1;
    idleCounter;
    holdTime = 60;
    constructor(pet) {
        this.leftBoundary = Math.floor(window.innerWidth * 0.95);
        this.pet = pet;
        this.idleCounter = 0;
    }
    nextFrame() {
        this.idleCounter++;
        this.pet.positionLeft(this.pet.left + this.pet.speed * this.speedMultiplier);
        if (this.pet.isMoving &&
            this.pet.left >= this.leftBoundary - this.pet.width) {
            return FrameResult.stateComplete;
        }
        else if (!this.pet.isMoving && this.idleCounter > this.holdTime) {
            return FrameResult.stateComplete;
        }
        return FrameResult.stateContinue;
    }
}
exports.WalkRightState = WalkRightState;
class WalkLeftState {
    label = "walk-left" /* States.walkLeft */;
    spriteLabel = 'walk';
    horizontalDirection = HorizontalDirection.left;
    pet;
    speedMultiplier = 1;
    idleCounter;
    holdTime = 60;
    constructor(pet) {
        this.pet = pet;
        this.idleCounter = 0;
    }
    nextFrame() {
        this.pet.positionLeft(this.pet.left - this.pet.speed * this.speedMultiplier);
        if (this.pet.isMoving && this.pet.left <= 0) {
            return FrameResult.stateComplete;
        }
        else if (!this.pet.isMoving && this.idleCounter > this.holdTime) {
            return FrameResult.stateComplete;
        }
        return FrameResult.stateContinue;
    }
}
exports.WalkLeftState = WalkLeftState;
class RunRightState extends WalkRightState {
    label = "run-right" /* States.runRight */;
    spriteLabel = 'walk_fast';
    speedMultiplier = 1.6;
    holdTime = 130;
}
exports.RunRightState = RunRightState;
class RunLeftState extends WalkLeftState {
    label = "run-left" /* States.runLeft */;
    spriteLabel = 'walk_fast';
    speedMultiplier = 1.6;
    holdTime = 130;
}
exports.RunLeftState = RunLeftState;
class ChaseState {
    label = "chase" /* States.chase */;
    spriteLabel = 'run';
    horizontalDirection = HorizontalDirection.left;
    ballState;
    canvas;
    pet;
    constructor(pet, ballState, canvas) {
        this.pet = pet;
        this.ballState = ballState;
        this.canvas = canvas;
    }
    nextFrame() {
        if (this.ballState.paused) {
            return FrameResult.stateCancel; // Ball is already caught
        }
        if (this.pet.left > this.ballState.cx) {
            this.horizontalDirection = HorizontalDirection.left;
            this.pet.positionLeft(this.pet.left - this.pet.speed);
        }
        else {
            this.horizontalDirection = HorizontalDirection.right;
            this.pet.positionLeft(this.pet.left + this.pet.speed);
        }
        if (this.canvas.height - this.ballState.cy <
            this.pet.width + this.pet.floor &&
            this.ballState.cx < this.pet.left &&
            this.pet.left < this.ballState.cx + 15) {
            // hide ball
            this.canvas.style.display = 'none';
            this.ballState.paused = true;
            return FrameResult.stateComplete;
        }
        return FrameResult.stateContinue;
    }
}
exports.ChaseState = ChaseState;
class ChaseFriendState {
    label = "chase-friend" /* States.chaseFriend */;
    spriteLabel = 'run';
    horizontalDirection = HorizontalDirection.left;
    pet;
    constructor(pet) {
        this.pet = pet;
    }
    nextFrame() {
        if (!this.pet.hasFriend || !this.pet.friend?.isPlaying) {
            return FrameResult.stateCancel; // Friend is no longer playing.
        }
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        if (this.pet.left > this.pet.friend.left) {
            this.horizontalDirection = HorizontalDirection.left;
            this.pet.positionLeft(this.pet.left - this.pet.speed);
        }
        else {
            this.horizontalDirection = HorizontalDirection.right;
            this.pet.positionLeft(this.pet.left + this.pet.speed);
        }
        return FrameResult.stateContinue;
    }
}
exports.ChaseFriendState = ChaseFriendState;
class ClimbWallLeftState {
    label = "climb-wall-left" /* States.climbWallLeft */;
    spriteLabel = 'wallclimb';
    horizontalDirection = HorizontalDirection.left;
    pet;
    constructor(pet) {
        this.pet = pet;
    }
    nextFrame() {
        this.pet.positionBottom(this.pet.bottom + 1);
        if (this.pet.bottom >= 100) {
            return FrameResult.stateComplete;
        }
        return FrameResult.stateContinue;
    }
}
exports.ClimbWallLeftState = ClimbWallLeftState;
class JumpDownLeftState {
    label = "jump-down-left" /* States.jumpDownLeft */;
    spriteLabel = 'fall_from_grab';
    horizontalDirection = HorizontalDirection.right;
    pet;
    constructor(pet) {
        this.pet = pet;
    }
    nextFrame() {
        this.pet.positionBottom(this.pet.bottom - 5);
        if (this.pet.bottom <= this.pet.floor) {
            this.pet.positionBottom(this.pet.floor);
            return FrameResult.stateComplete;
        }
        return FrameResult.stateContinue;
    }
}
exports.JumpDownLeftState = JumpDownLeftState;


/***/ })

},
/******/ __webpack_require__ => { // webpackRuntimeModules
/******/ var __webpack_exec__ = (moduleId) => (__webpack_require__(__webpack_require__.s = moduleId))
/******/ var __webpack_exports__ = (__webpack_exec__("./src/panel/main.ts"));
/******/ }
]);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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QUFDO0lBQzNCLENBQUM7O0FBbEZMLGtCQW1GQztBQUVZLGlCQUFTLEdBQTBCO0lBQzVDLE9BQU87SUFDUCxTQUFTO0lBQ1QsT0FBTztJQUNQLE1BQU07SUFDTixNQUFNO0lBQ04sT0FBTztJQUNQLE1BQU07SUFDTixRQUFRO0lBQ1IsTUFBTTtJQUNOLE9BQU87SUFDUCxRQUFRO0lBQ1IsT0FBTztJQUNQLE9BQU87SUFDUCxNQUFNO0lBQ04sU0FBUztJQUNULE1BQU07SUFDTixPQUFPO0lBQ1AsTUFBTTtJQUNOLE1BQU07SUFDTixRQUFRO0lBQ1IsT0FBTztJQUNQLFFBQVE7SUFDUixNQUFNO0lBQ04sT0FBTztJQUNQLE9BQU87SUFDUCxNQUFNO0lBQ04sUUFBUTtJQUNSLFFBQVE7SUFDUixNQUFNO0lBQ04sT0FBTztJQUNQLEtBQUs7SUFDTCxRQUFRO0lBQ1IsUUFBUTtJQUNSLEtBQUs7SUFDTCxRQUFRO0lBQ1IsUUFBUTtJQUNSLE9BQU87SUFDUCxNQUFNO0lBQ04sT0FBTztJQUNQLFFBQVE7SUFDUixPQUFPO0lBQ1AsTUFBTTtJQUNOLE9BQU87SUFDUCxPQUFPO0lBQ1AsU0FBUztJQUNULE1BQU07SUFDTixLQUFLO0lBQ0wsUUFBUTtJQUNSLE9BQU87SUFDUCxPQUFPO0lBQ1AsS0FBSztJQUNMLFFBQVE7SUFDUixRQUFRO0lBQ1IsUUFBUTtJQUNSLFFBQVE7SUFDUixPQUFPO0lBQ1AsT0FBTztJQUNQLE9BQU87SUFDUCxPQUFPO0lBQ1AsUUFBUTtJQUNSLE9BQU87SUFDUCxPQUFPO0lBQ1AsT0FBTztJQUNQLE9BQU87SUFDUCxPQUFPO0lBQ1AsT0FBTztJQUNQLFFBQVE7SUFDUixLQUFLO0lBQ0wsT0FBTztJQUNQLE9BQU87SUFDUCxNQUFNO0lBQ04sUUFBUTtJQUNSLFFBQVE7SUFDUixRQUFRO0lBQ1IsT0FBTztJQUNQLEtBQUs7SUFDTCxLQUFLO0lBQ0wsT0FBTztJQUNQLEtBQUs7SUFDTCxPQUFPO0lBQ1AsTUFBTTtJQUNOLE1BQU07SUFDTixPQUFPO0lBQ1AsTUFBTTtJQUNOLE1BQU07SUFD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SUFDTixNQUFNO0lBQ04sUUFBUTtJQUNSLE9BQU87SUFDUCxPQUFPO0lBQ1AsUUFBUTtJQUNSLE1BQU07SUFDTixPQUFPO0lBQ1AsT0FBTztJQUNQLE1BQU07SUFDTixRQUFRO0lBQ1IsUUFBUTtJQUNSLE1BQU07SUFDTixLQUFLO0lBQ0wsUUFBUTtJQUNSLFFBQVE7SUFDUixLQUFLO0lBQ0wsUUFBUTtJQUNSLFFBQVE7SUFDUixPQUFPO0lBQ1AsTUFBTTtJQUNOLFFBQVE7SUFDUixPQUFPO0lBQ1AsTUFBTTtJQUNOLE9BQU87SUFDUCxPQUFPO0lBQ1AsU0FBUztJQUNULE1BQU07SUFDTixLQUFLO0lBQ0wsUUFBUTtJQUNSLE9BQU87SUFDUCxPQUFPO0lBQ1AsS0FBSztJQUNMLFFBQVE7SUFDUixRQUFRO0lBQ1IsUUFBUTtJQUNSLFFBQVE7SUFDUixRQUFRO0lBQ1IsT0FBTztJQUNQLE9BQU87SUFDUCxPQUFPO0lBQ1AsT0FBTztJQUNQLFFBQVE7SUFDUixPQUFPO0lBQ1AsT0FBTztJQUNQLE9BQU87SUFDUCxPQUFPO0lBQ1AsT0FBTztJQUNQLFFBQVE7SUFDUixLQUFLO0lBQ0wsUUFBUTtJQUNSLE9BQU87SUFDUCxPQUFPO0lBQ1AsTUFBTTtJQUNOLFFBQVE7SUFDUixRQUFRO0lBQ1IsUUFBUTtJQUNSLE9BQU87SUFDUCxLQUFLO0lBQ0wsS0FBSztJQUNMLE9BQU87SUFDUCxTQUFTO0lBQ1QsS0FBSztJQUNMLE9BQU87SUFDUCxNQUFNO0lBQ04sTUFBTTtJQUNOLE9BQU87SUFDUCxNQUFNO0lBQ04sTUFBTTtJQUNOLFNBQVM7SUFDVCxRQUFRO0lBQ1IsUUFBUTtJQUNSLE9BQU87SUFDUCxTQUFTO0lBQ1QsTUFBTTtJQUNOLE1BQU07SUFDTixPQUFPO0lBQ1AsTUFBTTtJQUNOLEtBQUs7SUFDTCxPQUFPO0lBQ1AsT0FBTztJQUNQLFVBQVU7SUFDVixTQUFTO0lBQ1QsUUFBUTtJQUNSLFFBQVE7SUFDUixPQUFPO0lBQ1AsTUFBTTtJQUNOLFFBQVE7SUFDUixNQUFNO0lBQ04sT0FBTztJQUNQLE9BQU87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QU87SUFDUCxPQUFPO0lBQ1AsTUFBTTtJQUNOLFNBQVM7SUFDVCxNQUFNO0lBQ04sT0FBTztJQUNQLE1BQU07SUFDTixRQUFRO0lBQ1IsT0FBTztJQUNQLE9BQU87SUFDUCxNQUFNO0lBQ04sUUFBUTtJQUNSLE1BQU07SUFDTixPQUFPO0lBQ1AsS0FBSztJQUNMLFFBQVE7SUFDUixLQUFLO0lBQ0wsT0FBTztJQUNQLE1BQU07SUFDTixPQUFPO0lBQ1AsUUFBUTtJQUNSLE9BQU87SUFDUCxNQUFNO0lBQ04sT0FBTztJQUNQLEtBQUs7SUFDTCxPQUFPO0lBQ1AsT0FBTztJQUNQLE9BQU87SUFDUCxPQUFPO0lBQ1AsT0FBTztJQUNQLE9BQU87SUFDUCxRQUFRO0lBQ1IsT0FBTztJQUNQLE1BQU07SUFDTixRQUFRO0lBQ1IsUUFBUTtJQUNSLE9BQU87SUFDUCxLQUFLO0lBQ0wsS0FBSztJQUNMLE9BQU87SUFDUCxLQUFLO0lBQ0wsT0FBTztJQUNQLE1BQU07SUFDTixNQUFNO0lBQ04sT0FBTztJQUNQLE1BQU07SUFDTixNQUFNO0lBQ04sUUFBUTtJQUNSLFFBQVE7SUFDUixPQUFPO0lBQ1AsT0FBTztJQUNQLE1BQU07SUFDTixNQUFNO0lBQ04sTUFBTTtJQUNOLFFBQVE7SUFDUixPQUFPO0lBQ1AsUUFBUTtJQUNSLFFBQVE7SUFDUixPQUFPO0lBQ1AsVUFBVTtJQUNWLFNBQVM7SUFDVCxRQUFRO0lBQ1IsTUFBTTtJQUNOLE9BQU87SUFDUCxPQUFPO0lBQ1AsT0FBTztJQUNQLEtBQUs7SUFDTCxPQUFPO0lBQ1AsT0FBTztJQUNQLE9BQU87SUFDUCxPQUFPO0lBQ1AsVUFBVTtJQUNWLE9BQU87SUFDUCxTQUFTO0lBQ1QsUUFBUTtJQUNSLE9BQU87SUFDUCxNQUFNO0lBQ04sS0FBSztJQUNMLE1BQU07SUFDTixNQUFNO0lBQ04sUUFBUTtJQUNSLE1BQU07SUFDTixTQUFTO0lBQ1QsT0FBTztJQUNQLFFBQVE7SUFDUixhQUFhO0lBQ2IsV0FBVztJQUNYLE9BQU87SUFDUCxNQUFNO0lBQ04sU0FBUztJQUNULE1B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bkIsQ0FBQztJQUVELFNBQVM7UUFDTCxJQUFJLENBQUMsR0FBRyxDQUFDLGNBQWMsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUMsQ0FBQztRQUM3QyxJQUFJLElBQUksQ0FBQyxHQUFHLENBQUMsTUFBTSxJQUFJLEdBQUcsRUFBRTtZQUN4QixPQUFPLFdBQVcsQ0FBQyxhQUFhLENBQUM7U0FDcEM7UUFDRCxPQUFPLFdBQVcsQ0FBQyxhQUFhLENBQUM7SUFDckMsQ0FBQztDQUNKO0FBakJELGdEQWlCQztBQUVELE1BQWEsaUJBQWlCO0lBQzFCLEtBQUssOENBQXVCO0lBQzVCLFdBQVcsR0FBRyxnQkFBZ0IsQ0FBQztJQUMvQixtQkFBbUIsR0FBRyxtQkFBbUIsQ0FBQyxLQUFLLENBQUM7SUFDaEQsR0FBRyxDQUFXO0lBRWQsWUFBWSxHQUFhO1FBQ3JCLElBQUksQ0FBQyxHQUFHLEdBQUcsR0FBRyxDQUFDO0lBQ25CLENBQUM7SUFFRCxTQUFTO1FBQ0wsSUFBSSxDQUFDLEdBQUcsQ0FBQyxjQUFjLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDLENBQUM7UUFDN0MsSUFBSSxJQUFJLENBQUMsR0FBRyxDQUFDLE1BQU0sSUFBSSxJQUFJLENBQUMsR0FBRyxDQUFDLEtBQUssRUFBRTtZQUNuQyxJQUFJLENBQUMsR0FBRyxDQUFDLGNBQWMsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxDQUFDO1lBQ3hDLE9BQU8sV0FBVyxDQUFDLGFBQWEsQ0FBQztTQUNwQztRQUNELE9BQU8sV0FBVyxDQUFDLGFBQWEsQ0FBQztJQUNyQyxDQUFDO0NBQ0o7QUFsQkQsOENBa0JDIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vcGV0c3Rlc3QvLi9zcmMvcGFuZWwvYmFzZXBldHR5cGUudHMiLCJ3ZWJwYWNrOi8vcGV0c3Rlc3QvLi9zcmMvcGFuZWwvbWFpbi50cyIsIndlYnBhY2s6Ly9wZXRzdGVzdC8uL3NyYy9wYW5lbC9wZXRzLnRzIiwid2VicGFjazovL3BldHN0ZXN0Ly4vc3JjL3BhbmVsL3BldHMvY2F0LnRzIiwid2VicGFjazovL3BldHN0ZXN0Ly4vc3JjL3BhbmVsL3BldHMvY2hpY2tlbi50cyIsIndlYnBhY2s6Ly9wZXRzdGVzdC8uL3NyYy9wYW5lbC9wZXRzL2NsaXBweS50cyIsIndlYnBhY2s6Ly9wZXRzdGVzdC8uL3NyYy9wYW5lbC9wZXRzL2NvY2thdGllbC50cyIsIndlYnBhY2s6Ly9wZXRzdGVzdC8uL3NyYy9wYW5lbC9wZXRzL2NyYWIudHMiLCJ3ZWJwYWNrOi8vcGV0c3Rlc3QvLi9zcmMvcGFuZWwvcGV0cy9kb2cudHMiLCJ3ZWJwYWNrOi8vcGV0c3Rlc3QvLi9zcmMvcGFuZWwvcGV0cy9mb3gudHMiLCJ3ZWJwYWNrOi8vcGV0c3Rlc3QvLi9zcmMvcGFuZWwvcGV0cy9tb2QudHMiLCJ3ZWJwYWNrOi8vcGV0c3Rlc3QvLi9zcmMvcGFuZWwvcGV0cy9yYXQudHMiLCJ3ZWJwYWNrOi8vcGV0c3Rlc3QvLi9zcmMvcGFuZWwvcGV0cy9yb2NreS50cyIsIndlYnBhY2s6Ly9wZXRzdGVzdC8uL3NyYy9wYW5lbC9wZXRzL3J1YmJlcmR1Y2sudHMiLCJ3ZWJwYWNrOi8vcGV0c3Rlc3QvLi9zcmMvcGFuZWwvcGV0cy9zbmFrZS50cyIsIndlYnBhY2s6Ly9wZXRzdGVzdC8uL3NyYy9wYW5lbC9wZXRzL3RvdG9yby50cyIsIndlYnBhY2s6Ly9wZXRzdGVzdC8uL3NyYy9wYW5lbC9wZXRzL3R1cnRsZS50cyIsIndlYnBhY2s6Ly9wZXRzdGVzdC8uL3NyYy9wYW5lbC9wZXRzL3phcHB5LnRzIiwid2VicGFjazovL3BldHN0ZXN0Ly4vc3JjL3BhbmVsL3N0YXRlcy50cyJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBQZXRDb2xvciwgUGV0U2l6ZSwgUGV0U3BlZWQgfSBmcm9tICcuLi9jb21tb24vdHlwZXMnO1xuaW1wb3J0IHsgSVBldFR5cGUgfSBmcm9tICcuL3N0YXRlcyc7XG5pbXBvcnQgeyBJU2VxdWVuY2VUcmVlIH0gZnJvbSAnLi9zZXF1ZW5jZXMnO1xuaW1wb3J0IHtcbiAgICBTdGF0ZXMsXG4gICAgSVN0YXRlLFxuICAgIHJlc29sdmVTdGF0ZSxcbiAgICBQZXRJbnN0YW5jZVN0YXRlLFxuICAgIGlzU3RhdGVBYm92ZUdyb3VuZCxcbiAgICBCYWxsU3RhdGUsXG4gICAgQ2hhc2VTdGF0ZSxcbiAgICBIb3Jpem9udGFsRGlyZWN0aW9uLFxuICAgIEZyYW1lUmVzdWx0LFxufSBmcm9tICcuL3N0YXRlcyc7XG5cbmV4cG9ydCBjbGFzcyBJbnZhbGlkU3RhdGVFeGNlcHRpb24ge31cblxuZXhwb3J0IGFic3RyYWN0IGNsYXNzIEJhc2VQZXRUeXBlIGltcGxlbWVudHMgSVBldFR5cGUge1xuICAgIGxhYmVsOiBzdHJpbmcgPSAnYmFzZSc7XG4gICAgc3RhdGljIGNvdW50OiBudW1iZXIgPSAwO1xuICAgIHNlcXVlbmNlOiBJU2VxdWVuY2VUcmVlID0ge1xuICAgICAgICBzdGFydGluZ1N0YXRlOiBTdGF0ZXMuc2l0SWRsZSxcbiAgICAgICAgc2VxdWVuY2VTdGF0ZXM6IFtdLFxuICAgIH07XG4gICAgc3RhdGljIHBvc3NpYmxlQ29sb3JzOiBQZXRDb2xvcltdO1xuICAgIGN1cnJlbnRTdGF0ZTogSVN0YXRlO1xuICAgIGN1cnJlbnRTdGF0ZUVudW06IFN0YXRlcztcbiAgICBob2xkU3RhdGU6IElTdGF0ZSB8IHVuZGVmaW5lZDtcbiAgICBob2xkU3RhdGVFbnVtOiBTdGF0ZXMgfCB1bmRlZmluZWQ7XG4gICAgcHJpdmF0ZSBlbDogSFRNTEltYWdlRWxlbWVudDtcbiAgICBwcml2YXRlIGNvbGxpc2lvbjogSFRNTERpdkVsZW1lbnQ7XG4gICAgcHJpdmF0ZSBzcGVlY2g6IEhUTUxEaXZFbGVtZW50O1xuICAgIHByaXZhdGUgX2xlZnQ6IG51bWJlcjtcbiAgICBwcml2YXRlIF9ib3R0b206IG51bWJlcjtcbiAgICBwZXRSb290OiBzdHJpbmc7XG4gICAgX2Zsb29yOiBudW1iZXI7XG4gICAgX2ZyaWVuZDogSVBldFR5cGUgfCB1bmRlZmluZWQ7XG4gICAgcHJpdmF0ZSBfbmFtZTogc3RyaW5nO1xuICAgIHByaXZhdGUgX3NwZWVkOiBudW1iZXI7XG4gICAgcHJpdmF0ZSBfc2l6ZTogUGV0U2l6ZTtcblxuICAgIGNvbnN0cnVjdG9yKFxuICAgICAgICBzcHJpdGVFbGVtZW50OiBIVE1MSW1hZ2VFbGVtZW50LFxuICAgICAgICBjb2xsaXNpb25FbGVtZW50OiBIVE1MRGl2RWxlbWVudCxcbiAgICAgICAgc3BlZWNoRWxlbWVudDogSFRNTERpdkVsZW1lbnQsXG4gICAgICAgIHNpemU6IFBldFNpemUsXG4gICAgICAgIGxlZnQ6IG51bWJlcixcbiAgICAgICAgYm90dG9tOiBudW1iZXIsXG4gICAgICAgIHBldFJvb3Q6IHN0cmluZyxcbiAgICAgICAgZmxvb3I6IG51bWJlcixcbiAgICAgICAgbmFtZTogc3RyaW5nLFxuICAgICAgICBzcGVlZDogbnVtYmVyLFxuICAgICkge1xuICAgICAgICB0aGlzLmVsID0gc3ByaXRlRWxlbWVudDtcbiAgICAgICAgdGhpcy5jb2xsaXNpb24gPSBjb2xsaXNpb25FbGVtZW50O1xuICAgICAgICB0aGlzLnNwZWVjaCA9IHNwZWVjaEVsZW1lbnQ7XG4gICAgICAgIHRoaXMucGV0Um9vdCA9IHBldFJvb3Q7XG4gICAgICAgIHRoaXMuX2Zsb29yID0gZmxvb3I7XG4gICAgICAgIHRoaXMuX2xlZnQgPSBsZWZ0O1xuICAgICAgICB0aGlzLl9ib3R0b20gPSBib3R0b207XG4gICAgICAgIHRoaXMuaW5pdFNwcml0ZShzaXplLCBsZWZ0LCBib3R0b20pO1xuICAgICAgICB0aGlzLmN1cnJlbnRTdGF0ZUVudW0gPSB0aGlzLnNlcXVlbmNlLnN0YXJ0aW5nU3RhdGU7XG4gICAgICAgIHRoaXMuY3VycmVudFN0YXRlID0gcmVzb2x2ZVN0YXRlKHRoaXMuY3VycmVudFN0YXRlRW51bSwgdGhpcyk7XG5cbiAgICAgICAgdGhpcy5fbmFtZSA9IG5hbWU7XG4gICAgICAgIHRoaXMuX3NpemUgPSBzaXplO1xuICAgICAgICB0aGlzLl9zcGVlZCA9IHRoaXMucmFuZG9taXplU3BlZWQoc3BlZWQpO1xuXG4gICAgICAgIC8vIEluY3JlbWVudCB0aGUgc3RhdGljIGNvdW50IG9mIHRoZSBQZXQgY2xhc3MgdGhhdCB0aGUgY29uc3RydWN0b3IgYmVsb25ncyB0b1xuICAgICAgICAodGhpcy5jb25zdHJ1Y3RvciBhcyBhbnkpLmNvdW50ICs9IDE7XG4gICAgfVxuXG4gICAgaW5pdFNwcml0ZShwZXRTaXplOiBQZXRTaXplLCBsZWZ0OiBudW1iZXIsIGJvdHRvbTogbnVtYmVyKSB7XG4gICAgICAgIHRoaXMuZWwuc3R5bGUubGVmdCA9IGAke2xlZnR9cHhgO1xuICAgICAgICB0aGlzLmVsLnN0eWxlLmJvdHRvbSA9IGAke2JvdHRvbX1weGA7XG4gICAgICAgIHRoaXMuZWwuc3R5bGUud2lkdGggPSAnYXV0byc7XG4gICAgICAgIHRoaXMuZWwuc3R5bGUuaGVpZ2h0ID0gJ2F1dG8nO1xuICAgICAgICB0aGlzLmVsLnN0eWxlLm1heFdpZHRoID0gYCR7dGhpcy5jYWxjdWxhdGVTcHJpdGVXaWR0aChwZXRTaXplKX1weGA7XG4gICAgICAgIHRoaXMuZWwuc3R5bGUubWF4SGVpZ2h0ID0gYCR7dGhpcy5jYWxjdWxhdGVTcHJpdGVXaWR0aChwZXRTaXplKX1weGA7XG4gICAgICAgIHRoaXMuY29sbGlzaW9uLnN0eWxlLmxlZnQgPSBgJHtsZWZ0fXB4YDtcbiAgICAgICAgdGhpcy5jb2xsaXNpb24uc3R5bGUuYm90dG9tID0gYCR7Ym90dG9tfXB4YDtcbiAgICAgICAgdGhpcy5jb2xsaXNpb24uc3R5bGUud2lkdGggPSBgJHt0aGlzLmNhbGN1bGF0ZVNwcml0ZVdpZHRoKHBldFNpemUpfXB4YDtcbiAgICAgICAgdGhpcy5jb2xsaXNpb24uc3R5bGUuaGVpZ2h0ID0gYCR7dGhpcy5jYWxjdWxhdGVTcHJpdGVXaWR0aChwZXRTaXplKX1weGA7XG4gICAgICAgIHRoaXMuc3BlZWNoLnN0eWxlLmxlZnQgPSBgJHtsZWZ0fXB4YDtcbiAgICAgICAgdGhpcy5zcGVlY2guc3R5bGUuYm90dG9tID0gYCR7XG4gICAgICAgICAgICBib3R0b20gKyB0aGlzLmNhbGN1bGF0ZVNwcml0ZVdpZHRoKHBldFNpemUpXG4gICAgICAgIH1weGA7XG4gICAgICAgIHRoaXMuaGlkZVNwZWVjaEJ1YmJsZSgpO1xuICAgIH1cblxuICAgIGdldCBsZWZ0KCk6IG51bWJlciB7XG4gICAgICAgIHJldHVybiB0aGlzLl9sZWZ0O1xuICAgIH1cblxuICAgIGdldCBib3R0b20oKTogbnVtYmVyIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX2JvdHRvbTtcbiAgICB9XG5cbiAgICBwcml2YXRlIHJlcG9zaXRpb25BY2NvbXBhbnlpbmdFbGVtZW50cygpIHtcbiAgICAgICAgdGhpcy5jb2xsaXNpb24uc3R5bGUubGVmdCA9IGAke3RoaXMuX2xlZnR9cHhgO1xuICAgICAgICB0aGlzLmNvbGxpc2lvbi5zdHlsZS5ib3R0b20gPSBgJHt0aGlzLl9ib3R0b219cHhgO1xuICAgICAgICB0aGlzLnNwZWVjaC5zdHlsZS5sZWZ0ID0gYCR7dGhpcy5fbGVmdH1weGA7XG4gICAgICAgIHRoaXMuc3BlZWNoLnN0eWxlLmJvdHRvbSA9IGAke1xuICAgICAgICAgICAgdGhpcy5fYm90dG9tICsgdGhpcy5jYWxjdWxhdGVTcHJpdGVXaWR0aCh0aGlzLl9zaXplKVxuICAgICAgICB9cHhgO1xuICAgIH1cblxuICAgIGNhbGN1bGF0ZVNwcml0ZVdpZHRoKHNpemU6IFBldFNpemUpOiBudW1iZXIge1xuICAgICAgICBpZiAoc2l6ZSA9PT0gUGV0U2l6ZS5uYW5vKSB7XG4gICAgICAgICAgICByZXR1cm4gMzA7XG4gICAgICAgIH0gZWxzZSBpZiAoc2l6ZSA9PT0gUGV0U2l6ZS5zbWFsbCkge1xuICAgICAgICAgICAgcmV0dXJuIDQwO1xuICAgICAgICB9IGVsc2UgaWYgKHNpemUgPT09IFBldFNpemUubWVkaXVtKSB7XG4gICAgICAgICAgICByZXR1cm4gNTU7XG4gICAgICAgIH0gZWxzZSBpZiAoc2l6ZSA9PT0gUGV0U2l6ZS5sYXJnZSkge1xuICAgICAgICAgICAgcmV0dXJuIDExMDtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiAzMDsgLy8gU2hydWdcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHBvc2l0aW9uQm90dG9tKGJvdHRvbTogbnVtYmVyKTogdm9pZCB7XG4gICAgICAgIHRoaXMuX2JvdHRvbSA9IGJvdHRvbTtcbiAgICAgICAgdGhpcy5lbC5zdHlsZS5ib3R0b20gPSBgJHt0aGlzLl9ib3R0b219cHhgO1xuICAgICAgICB0aGlzLnJlcG9zaXRpb25BY2NvbXBhbnlpbmdFbGVtZW50cygpO1xuICAgIH1cblxuICAgIHBvc2l0aW9uTGVmdChsZWZ0OiBudW1iZXIpOiB2b2lkIHtcbiAgICAgICAgdGhpcy5fbGVmdCA9IGxlZnQ7XG4gICAgICAgIHRoaXMuZWwuc3R5bGUubGVmdCA9IGAke3RoaXMuX2xlZnR9cHhgO1xuICAgICAgICB0aGlzLnJlcG9zaXRpb25BY2NvbXBhbnlpbmdFbGVtZW50cygpO1xuICAgIH1cblxuICAgIGdldCB3aWR0aCgpOiBudW1iZXIge1xuICAgICAgICByZXR1cm4gdGhpcy5lbC53aWR0aDtcbiAgICB9XG5cbiAgICBnZXQgZmxvb3IoKTogbnVtYmVyIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX2Zsb29yO1xuICAgIH1cblxuICAgIGdldCBoZWxsbygpOiBzdHJpbmcge1xuICAgICAgICAvLyByZXR1cm4gdGhlIHNvdW5kIG9mIHRoZSBuYW1lIG9mIHRoZSBhbmltYWxcbiAgICAgICAgcmV0dXJuIGAgc2F5cyBoZWxsbyDwn5GLIWA7XG4gICAgfVxuXG4gICAgZ2V0U3RhdGUoKTogUGV0SW5zdGFuY2VTdGF0ZSB7XG4gICAgICAgIHJldHVybiB7IGN1cnJlbnRTdGF0ZUVudW06IHRoaXMuY3VycmVudFN0YXRlRW51bSB9O1xuICAgIH1cblxuICAgIGdldCBzcGVlZCgpOiBudW1iZXIge1xuICAgICAgICByZXR1cm4gdGhpcy5fc3BlZWQ7XG4gICAgfVxuXG4gICAgcmFuZG9taXplU3BlZWQoc3BlZWQ6IG51bWJlcik6IG51bWJlciB7XG4gICAgICAgIGNvbnN0IG1pbiA9IHNwZWVkICogMC43O1xuICAgICAgICBjb25zdCBtYXggPSBzcGVlZCAqIDEuMztcbiAgICAgICAgY29uc3QgbmV3U3BlZWQgPSBNYXRoLnJhbmRvbSgpICogKG1heCAtIG1pbikgKyBtaW47XG4gICAgICAgIHJldHVybiBuZXdTcGVlZDtcbiAgICB9XG5cbiAgICBnZXQgaXNNb3ZpbmcoKTogYm9vbGVhbiB7XG4gICAgICAgIHJldHVybiB0aGlzLl9zcGVlZCAhPT0gUGV0U3BlZWQuc3RpbGw7XG4gICAgfVxuXG4gICAgcmVjb3ZlckZyaWVuZChmcmllbmQ6IElQZXRUeXBlKSB7XG4gICAgICAgIC8vIFJlY292ZXIgZnJpZW5kcy4uXG4gICAgICAgIHRoaXMuX2ZyaWVuZCA9IGZyaWVuZDtcbiAgICB9XG5cbiAgICByZWNvdmVyU3RhdGUoc3RhdGU6IFBldEluc3RhbmNlU3RhdGUpIHtcbiAgICAgICAgLy8gVE9ETyA6IFJlc29sdmUgYSBidWcgd2hlcmUgaWYgaXQgd2FzIHN3aXBpbmcgYmVmb3JlLCBpdCB3b3VsZCBmYWlsXG4gICAgICAgIC8vIGJlY2F1c2UgaG9sZFN0YXRlIGlzIG5vIGxvbmdlciB2YWxpZC5cbiAgICAgICAgdGhpcy5jdXJyZW50U3RhdGVFbnVtID0gc3RhdGUuY3VycmVudFN0YXRlRW51bSA/PyBTdGF0ZXMuc2l0SWRsZTtcbiAgICAgICAgdGhpcy5jdXJyZW50U3RhdGUgPSByZXNvbHZlU3RhdGUodGhpcy5jdXJyZW50U3RhdGVFbnVtLCB0aGlzKTtcblxuICAgICAgICBpZiAoIWlzU3RhdGVBYm92ZUdyb3VuZCh0aGlzLmN1cnJlbnRTdGF0ZUVudW0pKSB7XG4gICAgICAgICAgICAvLyBSZXNldCB0aGUgYm90dG9tIG9mIHRoZSBzcHJpdGUgdG8gdGhlIGZsb29yIGFzIHRoZSB0aGVtZVxuICAgICAgICAgICAgLy8gaGFzIGxpa2VseSBjaGFuZ2VkLlxuICAgICAgICAgICAgdGhpcy5wb3NpdGlvbkJvdHRvbSh0aGlzLmZsb29yKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGdldCBjYW5Td2lwZSgpIHtcbiAgICAgICAgcmV0dXJuICFpc1N0YXRlQWJvdmVHcm91bmQodGhpcy5jdXJyZW50U3RhdGVFbnVtKTtcbiAgICB9XG5cbiAgICBnZXQgY2FuQ2hhc2UoKSB7XG4gICAgICAgIHJldHVybiAhaXNTdGF0ZUFib3ZlR3JvdW5kKHRoaXMuY3VycmVudFN0YXRlRW51bSkgJiYgdGhpcy5pc01vdmluZztcbiAgICB9XG5cbiAgICBzaG93U3BlZWNoQnViYmxlKG1lc3NhZ2U6IHN0cmluZywgZHVyYXRpb246IG51bWJlciA9IDMwMDApIHtcbiAgICAgICAgdGhpcy5zcGVlY2guaW5uZXJIVE1MID0gbWVzc2FnZTtcbiAgICAgICAgdGhpcy5zcGVlY2guc3R5bGUuZGlzcGxheSA9ICdibG9jayc7XG4gICAgICAgIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgICAgICAgdGhpcy5oaWRlU3BlZWNoQnViYmxlKCk7XG4gICAgICAgIH0sIGR1cmF0aW9uKTtcbiAgICB9XG5cbiAgICBoaWRlU3BlZWNoQnViYmxlKCkge1xuICAgICAgICB0aGlzLnNwZWVjaC5zdHlsZS5kaXNwbGF5ID0gJ25vbmUnO1xuICAgIH1cblxuICAgIHN3aXBlKCkge1xuICAgICAgICBpZiAodGhpcy5jdXJyZW50U3RhdGVFbnVtID09PSBTdGF0ZXMuc3dpcGUpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLmhvbGRTdGF0ZSA9IHRoaXMuY3VycmVudFN0YXRlO1xuICAgICAgICB0aGlzLmhvbGRTdGF0ZUVudW0gPSB0aGlzLmN1cnJlbnRTdGF0ZUVudW07XG4gICAgICAgIHRoaXMuY3VycmVudFN0YXRlRW51bSA9IFN0YXRlcy5zd2lwZTtcbiAgICAgICAgdGhpcy5jdXJyZW50U3RhdGUgPSByZXNvbHZlU3RhdGUodGhpcy5jdXJyZW50U3RhdGVFbnVtLCB0aGlzKTtcbiAgICAgICAgdGhpcy5zaG93U3BlZWNoQnViYmxlKCfwn5GLJyk7XG4gICAgfVxuXG4gICAgY2hhc2UoYmFsbFN0YXRlOiBCYWxsU3RhdGUsIGNhbnZhczogSFRNTENhbnZhc0VsZW1lbnQpIHtcbiAgICAgICAgdGhpcy5jdXJyZW50U3RhdGVFbnVtID0gU3RhdGVzLmNoYXNlO1xuICAgICAgICB0aGlzLmN1cnJlbnRTdGF0ZSA9IG5ldyBDaGFzZVN0YXRlKHRoaXMsIGJhbGxTdGF0ZSwgY2FudmFzKTtcbiAgICB9XG5cbiAgICBmYWNlTGVmdCgpIHtcbiAgICAgICAgdGhpcy5lbC5zdHlsZS50cmFuc2Zvcm0gPSAnc2NhbGVYKC0xKSc7XG4gICAgfVxuXG4gICAgZmFjZVJpZ2h0KCkge1xuICAgICAgICB0aGlzLmVsLnN0eWxlLnRyYW5zZm9ybSA9ICdzY2FsZVgoMSknO1xuICAgIH1cblxuICAgIHNldEFuaW1hdGlvbihmYWNlOiBzdHJpbmcpIHtcbiAgICAgICAgaWYgKHRoaXMuZWwuc3JjLmVuZHNXaXRoKGBfJHtmYWNlfV84ZnBzLmdpZmApKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5lbC5zcmMgPSBgJHt0aGlzLnBldFJvb3R9XyR7ZmFjZX1fOGZwcy5naWZgO1xuICAgIH1cblxuICAgIGNob29zZU5leHRTdGF0ZShmcm9tU3RhdGU6IFN0YXRlcyk6IFN0YXRlcyB7XG4gICAgICAgIC8vIFdvcmsgb3V0IG5leHQgc3RhdGVcbiAgICAgICAgdmFyIHBvc3NpYmxlTmV4dFN0YXRlczogU3RhdGVzW10gfCB1bmRlZmluZWQgPSB1bmRlZmluZWQ7XG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdGhpcy5zZXF1ZW5jZS5zZXF1ZW5jZVN0YXRlcy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgaWYgKHRoaXMuc2VxdWVuY2Uuc2VxdWVuY2VTdGF0ZXNbaV0uc3RhdGUgPT09IGZyb21TdGF0ZSkge1xuICAgICAgICAgICAgICAgIHBvc3NpYmxlTmV4dFN0YXRlcyA9XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuc2VxdWVuY2Uuc2VxdWVuY2VTdGF0ZXNbaV0ucG9zc2libGVOZXh0U3RhdGVzO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGlmICghcG9zc2libGVOZXh0U3RhdGVzKSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgSW52YWxpZFN0YXRlRXhjZXB0aW9uKCk7XG4gICAgICAgIH1cbiAgICAgICAgLy8gcmFuZG9tbHkgY2hvb3NlIHRoZSBuZXh0IHN0YXRlXG4gICAgICAgIGNvbnN0IGlkeCA9IE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIHBvc3NpYmxlTmV4dFN0YXRlcy5sZW5ndGgpO1xuICAgICAgICByZXR1cm4gcG9zc2libGVOZXh0U3RhdGVzW2lkeF07XG4gICAgfVxuXG4gICAgbmV4dEZyYW1lKCkge1xuICAgICAgICBpZiAoXG4gICAgICAgICAgICB0aGlzLmN1cnJlbnRTdGF0ZS5ob3Jpem9udGFsRGlyZWN0aW9uID09PSBIb3Jpem9udGFsRGlyZWN0aW9uLmxlZnRcbiAgICAgICAgKSB7XG4gICAgICAgICAgICB0aGlzLmZhY2VMZWZ0KCk7XG4gICAgICAgIH0gZWxzZSBpZiAoXG4gICAgICAgICAgICB0aGlzLmN1cnJlbnRTdGF0ZS5ob3Jpem9udGFsRGlyZWN0aW9uID09PSBIb3Jpem9udGFsRGlyZWN0aW9uLnJpZ2h0XG4gICAgICAgICkge1xuICAgICAgICAgICAgdGhpcy5mYWNlUmlnaHQoKTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLnNldEFuaW1hdGlvbih0aGlzLmN1cnJlbnRTdGF0ZS5zcHJpdGVMYWJlbCk7XG5cbiAgICAgICAgLy8gV2hhdCdzIG15IGJ1ZGR5IGRvaW5nP1xuICAgICAgICBpZiAoXG4gICAgICAgICAgICB0aGlzLmhhc0ZyaWVuZCAmJlxuICAgICAgICAgICAgdGhpcy5jdXJyZW50U3RhdGVFbnVtICE9PSBTdGF0ZXMuY2hhc2VGcmllbmQgJiZcbiAgICAgICAgICAgIHRoaXMuaXNNb3ZpbmdcbiAgICAgICAgKSB7XG4gICAgICAgICAgICBpZiAoXG4gICAgICAgICAgICAgICAgdGhpcy5mcmllbmQ/LmlzUGxheWluZyAmJlxuICAgICAgICAgICAgICAgICFpc1N0YXRlQWJvdmVHcm91bmQodGhpcy5jdXJyZW50U3RhdGVFbnVtKVxuICAgICAgICAgICAgKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5jdXJyZW50U3RhdGUgPSByZXNvbHZlU3RhdGUoU3RhdGVzLmNoYXNlRnJpZW5kLCB0aGlzKTtcbiAgICAgICAgICAgICAgICB0aGlzLmN1cnJlbnRTdGF0ZUVudW0gPSBTdGF0ZXMuY2hhc2VGcmllbmQ7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgdmFyIGZyYW1lUmVzdWx0ID0gdGhpcy5jdXJyZW50U3RhdGUubmV4dEZyYW1lKCk7XG4gICAgICAgIGlmIChmcmFtZVJlc3VsdCA9PT0gRnJhbWVSZXN1bHQuc3RhdGVDb21wbGV0ZSkge1xuICAgICAgICAgICAgLy8gSWYgcmVjb3ZlcmluZyBmcm9tIHN3aXBlLi5cbiAgICAgICAgICAgIGlmICh0aGlzLmhvbGRTdGF0ZSAmJiB0aGlzLmhvbGRTdGF0ZUVudW0pIHtcbiAgICAgICAgICAgICAgICB0aGlzLmN1cnJlbnRTdGF0ZSA9IHRoaXMuaG9sZFN0YXRlO1xuICAgICAgICAgICAgICAgIHRoaXMuY3VycmVudFN0YXRlRW51bSA9IHRoaXMuaG9sZFN0YXRlRW51bTtcbiAgICAgICAgICAgICAgICB0aGlzLmhvbGRTdGF0ZSA9IHVuZGVmaW5lZDtcbiAgICAgICAgICAgICAgICB0aGlzLmhvbGRTdGF0ZUVudW0gPSB1bmRlZmluZWQ7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB2YXIgbmV4dFN0YXRlID0gdGhpcy5jaG9vc2VOZXh0U3RhdGUodGhpcy5jdXJyZW50U3RhdGVFbnVtKTtcbiAgICAgICAgICAgIHRoaXMuY3VycmVudFN0YXRlID0gcmVzb2x2ZVN0YXRlKG5leHRTdGF0ZSwgdGhpcyk7XG4gICAgICAgICAgICB0aGlzLmN1cnJlbnRTdGF0ZUVudW0gPSBuZXh0U3RhdGU7XG4gICAgICAgIH0gZWxzZSBpZiAoZnJhbWVSZXN1bHQgPT09IEZyYW1lUmVzdWx0LnN0YXRlQ2FuY2VsKSB7XG4gICAgICAgICAgICBpZiAodGhpcy5jdXJyZW50U3RhdGVFbnVtID09PSBTdGF0ZXMuY2hhc2UpIHtcbiAgICAgICAgICAgICAgICB2YXIgbmV4dFN0YXRlID0gdGhpcy5jaG9vc2VOZXh0U3RhdGUoU3RhdGVzLmlkbGVXaXRoQmFsbCk7XG4gICAgICAgICAgICAgICAgdGhpcy5jdXJyZW50U3RhdGUgPSByZXNvbHZlU3RhdGUobmV4dFN0YXRlLCB0aGlzKTtcbiAgICAgICAgICAgICAgICB0aGlzLmN1cnJlbnRTdGF0ZUVudW0gPSBuZXh0U3RhdGU7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKHRoaXMuY3VycmVudFN0YXRlRW51bSA9PT0gU3RhdGVzLmNoYXNlRnJpZW5kKSB7XG4gICAgICAgICAgICAgICAgdmFyIG5leHRTdGF0ZSA9IHRoaXMuY2hvb3NlTmV4dFN0YXRlKFN0YXRlcy5pZGxlV2l0aEJhbGwpO1xuICAgICAgICAgICAgICAgIHRoaXMuY3VycmVudFN0YXRlID0gcmVzb2x2ZVN0YXRlKG5leHRTdGF0ZSwgdGhpcyk7XG4gICAgICAgICAgICAgICAgdGhpcy5jdXJyZW50U3RhdGVFbnVtID0gbmV4dFN0YXRlO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgZ2V0IGhhc0ZyaWVuZCgpOiBib29sZWFuIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX2ZyaWVuZCAhPT0gdW5kZWZpbmVkO1xuICAgIH1cblxuICAgIGdldCBmcmllbmQoKTogSVBldFR5cGUgfCB1bmRlZmluZWQge1xuICAgICAgICByZXR1cm4gdGhpcy5fZnJpZW5kO1xuICAgIH1cblxuICAgIGdldCBuYW1lKCk6IHN0cmluZyB7XG4gICAgICAgIHJldHVybiB0aGlzLl9uYW1lO1xuICAgIH1cblxuICAgIG1ha2VGcmllbmRzV2l0aChmcmllbmQ6IElQZXRUeXBlKTogYm9vbGVhbiB7XG4gICAgICAgIHRoaXMuX2ZyaWVuZCA9IGZyaWVuZDtcbiAgICAgICAgY29uc29sZS5sb2codGhpcy5uYW1lLCBcIjogSSdtIG5vdyBmcmllbmRzIOKdpO+4jyB3aXRoIFwiLCBmcmllbmQubmFtZSk7XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cblxuICAgIGdldCBpc1BsYXlpbmcoKTogYm9vbGVhbiB7XG4gICAgICAgIHJldHVybiAoXG4gICAgICAgICAgICB0aGlzLmlzTW92aW5nICYmXG4gICAgICAgICAgICAodGhpcy5jdXJyZW50U3RhdGVFbnVtID09PSBTdGF0ZXMucnVuUmlnaHQgfHxcbiAgICAgICAgICAgICAgICB0aGlzLmN1cnJlbnRTdGF0ZUVudW0gPT09IFN0YXRlcy5ydW5MZWZ0KVxuICAgICAgICApO1xuICAgIH1cblxuICAgIGdldCBlbW9qaSgpOiBzdHJpbmcge1xuICAgICAgICByZXR1cm4gJ/CfkLYnO1xuICAgIH1cbn1cbiIsImltcG9ydCB7IHJhbmRvbU5hbWUgfSBmcm9tICcuLi9jb21tb24vbmFtZXMnO1xuaW1wb3J0IHtcbiAgICBQZXRTaXplLFxuICAgIFBldENvbG9yLFxuICAgIFBldFR5cGUsXG4gICAgVGhlbWUsXG4gICAgQ29sb3JUaGVtZUtpbmQsXG4gICAgV2Vidmlld01lc3NhZ2UsXG59IGZyb20gJy4uL2NvbW1vbi90eXBlcyc7XG5pbXBvcnQgeyBJUGV0VHlwZSB9IGZyb20gJy4vc3RhdGVzJztcbmltcG9ydCB7XG4gICAgY3JlYXRlUGV0LFxuICAgIFBldENvbGxlY3Rpb24sXG4gICAgUGV0RWxlbWVudCxcbiAgICBJUGV0Q29sbGVjdGlvbixcbiAgICBhdmFpbGFibGVDb2xvcnMsXG4gICAgSW52YWxpZFBldEV4Y2VwdGlvbixcbn0gZnJvbSAnLi9wZXRzJztcbmltcG9ydCB7IEJhbGxTdGF0ZSwgUGV0RWxlbWVudFN0YXRlLCBQZXRQYW5lbFN0YXRlIH0gZnJvbSAnLi9zdGF0ZXMnO1xudmFyIEljb24gPSAnLi9wYXdwcmludC5wbmcnO1xudmFyIGJhc2VQZXRVcmkgPSBcIi4uLy4uL21lZGlhL3RvdG9yby9cIjtcblxuZXhwb3J0IHZhciBhbGxQZXRzOiBJUGV0Q29sbGVjdGlvbiA9IG5ldyBQZXRDb2xsZWN0aW9uKCk7XG4vLyB2YXIgcGV0Q291bnRlcjogbnVtYmVyO1xuXG5mdW5jdGlvbiBjb21wb25lbnQoKSB7XG4gICAgY29uc3QgZWxlbWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgIGNvbnN0IGN2cyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2NhbnZhcycpO1xuICAgIGN2cy5pZCA9ICdwZXRDYW52YXMnO1xuICAgIGN2cy53aWR0aCA9IDE1MDtcbiAgICBjdnMuaGVpZ2h0ID0gMTUwO1xuXG4gICAgZWxlbWVudC5hcHBlbmRDaGlsZChjdnMpO1xuXG4gICAgcmV0dXJuIGVsZW1lbnQ7XG59XG5cbi8vIGZ1bmN0aW9uIHVwZGF0ZUNhbnZhcygpIHtcbi8vICAgICB2YXIgaW1nID0gbmV3IEltYWdlKCk7XG4vLyAgICAgaW1nLm9ubG9hZCA9IGZ1bmN0aW9uKCkge1xuLy8gICAgICAgICBjb25zdCBjYW52YXMgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgncGV0Q2FudmFzJyk7XG4vLyAgICAgICAgIHZhciBjdHggPSBjYW52YXMuZ2V0Q29udGV4dCgnMmQnKTtcbi8vICAgICAgICAgLy8gY3R4LmRyYXdJbWFnZShpbWcsIDAsIDApO1xuLy8gICAgICAgICB2YXIgaFJhdGlvID0gY2FudmFzLndpZHRoICAvIGltZy53aWR0aCAgICA7XG4vLyAgICAgICAgIHZhciB2UmF0aW8gPSAgY2FudmFzLmhlaWdodCAvIGltZy5oZWlnaHQgIDtcbi8vICAgICAgICAgdmFyIHJhdGlvICA9IE1hdGgubWluICggaFJhdGlvLCB2UmF0aW8gKTtcbi8vICAgICAgICAgdmFyIGNlbnRlclNoaWZ0X3ggPSAoIGNhbnZhcy53aWR0aCAtIGltZy53aWR0aCpyYXRpbyApIC8gMjtcbi8vICAgICAgICAgdmFyIGNlbnRlclNoaWZ0X3kgPSAoIGNhbnZhcy5oZWlnaHQgLSBpbWcuaGVpZ2h0KnJhdGlvICkgLyAyOyAgXG4vLyAgICAgICAgIGN0eC5jbGVhclJlY3QoMCwwLGNhbnZhcy53aWR0aCwgY2FudmFzLmhlaWdodCk7XG4vLyAgICAgICAgIGN0eC5kcmF3SW1hZ2UoaW1nLCAwLCAwLCBpbWcud2lkdGgsIGltZy5oZWlnaHQsXG4vLyAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2VudGVyU2hpZnRfeCxjZW50ZXJTaGlmdF95LGltZy53aWR0aCpyYXRpbywgaW1nLmhlaWdodCpyYXRpbyk7XG4vLyAgICAgfVxuLy8gICAgIGltZy5zcmMgPSBJY29uO1xuLy8gfVxuXG5mdW5jdGlvbiBoYW5kbGVNb3VzZU92ZXIoZTogTW91c2VFdmVudCkge1xuICAgIHZhciBlbCA9IGUuY3VycmVudFRhcmdldCBhcyBIVE1MRGl2RWxlbWVudDtcbiAgICBhbGxQZXRzLnBldHMuZm9yRWFjaCgoZWxlbWVudCkgPT4ge1xuICAgICAgICBpZiAoZWxlbWVudC5jb2xsaXNpb24gPT09IGVsKSB7XG4gICAgICAgICAgICBpZiAoIWVsZW1lbnQucGV0LmNhblN3aXBlKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxlbWVudC5wZXQuc3dpcGUoKTtcbiAgICAgICAgfVxuICAgIH0pO1xufVxuXG5cbmZ1bmN0aW9uIHN0YXJ0QW5pbWF0aW9ucyhcbiAgICBjb2xsaXNpb246IEhUTUxEaXZFbGVtZW50LFxuICAgIHBldDogSVBldFR5cGUsXG4pIHtcblxuICAgIGNvbGxpc2lvbi5hZGRFdmVudExpc3RlbmVyKCdtb3VzZW92ZXInLCBoYW5kbGVNb3VzZU92ZXIpO1xuICAgIHNldEludGVydmFsKCgpID0+IHtcbiAgICAgICAgcGV0Lm5leHRGcmFtZSgpO1xuICAgIH0sIDEwMCk7XG59XG5cbmZ1bmN0aW9uIGFkZFBldFRvUGFuZWwoXG4gICAgcGV0VHlwZTogUGV0VHlwZSxcbiAgICBiYXNlUGV0VXJpOiBzdHJpbmcsXG4gICAgcGV0Q29sb3I6IFBldENvbG9yLFxuICAgIHBldFNpemU6IFBldFNpemUsXG4gICAgbGVmdDogbnVtYmVyLFxuICAgIGJvdHRvbTogbnVtYmVyLFxuICAgIGZsb29yOiBudW1iZXIsXG4gICAgbmFtZTogc3RyaW5nLFxuKTogUGV0RWxlbWVudCB7XG4gICAgdmFyIHBldFNwcml0ZUVsZW1lbnQ6IEhUTUxJbWFnZUVsZW1lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdpbWcnKTtcbiAgICBwZXRTcHJpdGVFbGVtZW50LmNsYXNzTmFtZSA9ICdwZXQnO1xuICAgIChkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgncGV0c0NvbnRhaW5lcicpIGFzIEhUTUxEaXZFbGVtZW50KS5hcHBlbmRDaGlsZChcbiAgICAgICAgcGV0U3ByaXRlRWxlbWVudCxcbiAgICApO1xuXG4gICAgdmFyIGNvbGxpc2lvbkVsZW1lbnQ6IEhUTUxEaXZFbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgY29sbGlzaW9uRWxlbWVudC5jbGFzc05hbWUgPSAnY29sbGlzaW9uJztcbiAgICAoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3BldHNDb250YWluZXInKSBhcyBIVE1MRGl2RWxlbWVudCkuYXBwZW5kQ2hpbGQoXG4gICAgICAgIGNvbGxpc2lvbkVsZW1lbnQsXG4gICAgKTtcblxuICAgIHZhciBzcGVlY2hCdWJibGVFbGVtZW50OiBIVE1MRGl2RWxlbWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgIHNwZWVjaEJ1YmJsZUVsZW1lbnQuY2xhc3NOYW1lID0gYGJ1YmJsZSBidWJibGUtJHtwZXRTaXplfWA7XG4gICAgc3BlZWNoQnViYmxlRWxlbWVudC5pbm5lclRleHQgPSAnSGVsbG8hJztcbiAgICAoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3BldHNDb250YWluZXInKSBhcyBIVE1MRGl2RWxlbWVudCkuYXBwZW5kQ2hpbGQoXG4gICAgICAgIHNwZWVjaEJ1YmJsZUVsZW1lbnQsXG4gICAgKTtcblxuICAgIGNvbnN0IHJvb3QgPSBiYXNlUGV0VXJpICsgJy8nICsgcGV0VHlwZSArICcvJyArIHBldENvbG9yO1xuICAgIGNvbnNvbGUubG9nKCdDcmVhdGluZyBuZXcgcGV0IDogJywgcGV0VHlwZSwgcm9vdCwgcGV0Q29sb3IsIHBldFNpemUsIG5hbWUpO1xuICAgIHRyeSB7XG4gICAgICAgIGlmICghYXZhaWxhYmxlQ29sb3JzKHBldFR5cGUpLmluY2x1ZGVzKHBldENvbG9yKSkge1xuICAgICAgICAgICAgdGhyb3cgbmV3IEludmFsaWRQZXRFeGNlcHRpb24oJ0ludmFsaWQgY29sb3IgZm9yIHBldCB0eXBlJyk7XG4gICAgICAgIH1cbiAgICAgICAgdmFyIG5ld1BldCA9IGNyZWF0ZVBldChcbiAgICAgICAgICAgIHBldFR5cGUsXG4gICAgICAgICAgICBwZXRTcHJpdGVFbGVtZW50LFxuICAgICAgICAgICAgY29sbGlzaW9uRWxlbWVudCxcbiAgICAgICAgICAgIHNwZWVjaEJ1YmJsZUVsZW1lbnQsXG4gICAgICAgICAgICBwZXRTaXplLFxuICAgICAgICAgICAgbGVmdCxcbiAgICAgICAgICAgIGJvdHRvbSxcbiAgICAgICAgICAgIHJvb3QsXG4gICAgICAgICAgICBmbG9vcixcbiAgICAgICAgICAgIG5hbWUsXG4gICAgICAgICk7XG4gICAgICAgIC8vIHBldENvdW50ZXIrKztcbiAgICAgICAgc3RhcnRBbmltYXRpb25zKGNvbGxpc2lvbkVsZW1lbnQsIG5ld1BldCk7XG4gICAgfSBjYXRjaCAoZTogYW55KSB7XG4gICAgICAgIC8vIFJlbW92ZSBlbGVtZW50c1xuICAgICAgICBwZXRTcHJpdGVFbGVtZW50LnJlbW92ZSgpO1xuICAgICAgICBjb2xsaXNpb25FbGVtZW50LnJlbW92ZSgpO1xuICAgICAgICBzcGVlY2hCdWJibGVFbGVtZW50LnJlbW92ZSgpO1xuICAgICAgICB0aHJvdyBlO1xuICAgIH1cblxuICAgIHJldHVybiBuZXcgUGV0RWxlbWVudChcbiAgICAgICAgcGV0U3ByaXRlRWxlbWVudCxcbiAgICAgICAgY29sbGlzaW9uRWxlbWVudCxcbiAgICAgICAgc3BlZWNoQnViYmxlRWxlbWVudCxcbiAgICAgICAgbmV3UGV0LFxuICAgICAgICBwZXRDb2xvcixcbiAgICAgICAgcGV0VHlwZSxcbiAgICApO1xufVxuXG5cbmRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQoY29tcG9uZW50KCkpO1xuLy8gdXBkYXRlQ2FudmFzKCk7XG5hZGRQZXRUb1BhbmVsKFBldFR5cGUudG90b3JvLCBiYXNlUGV0VXJpLCBQZXRDb2xvci5ncmF5LCBQZXRTaXplLnNtYWxsLCAwLCAwLCAxNTAsIFBldFR5cGUudG90b3JvKTsiLCJpbXBvcnQgeyBQZXRDb2xvciwgUGV0U2l6ZSwgUGV0U3BlZWQsIFBldFR5cGUgfSBmcm9tICcuLi9jb21tb24vdHlwZXMnO1xuaW1wb3J0IHsgQ2F0IH0gZnJvbSAnLi9wZXRzL2NhdCc7XG5pbXBvcnQgeyBDaGlja2VuIH0gZnJvbSAnLi9wZXRzL2NoaWNrZW4nO1xuaW1wb3J0IHsgQ2xpcHB5IH0gZnJvbSAnLi9wZXRzL2NsaXBweSc7XG5pbXBvcnQgeyBDb2NrYXRpZWwgfSBmcm9tICcuL3BldHMvY29ja2F0aWVsJztcbmltcG9ydCB7IENyYWIgfSBmcm9tICcuL3BldHMvY3JhYic7XG5pbXBvcnQgeyBEb2cgfSBmcm9tICcuL3BldHMvZG9nJztcbmltcG9ydCB7IEZveCB9IGZyb20gJy4vcGV0cy9mb3gnO1xuaW1wb3J0IHsgTW9kIH0gZnJvbSAnLi9wZXRzL21vZCc7XG5pbXBvcnQgeyBSb2NreSB9IGZyb20gJy4vcGV0cy9yb2NreSc7XG5pbXBvcnQgeyBSdWJiZXJEdWNrIH0gZnJvbSAnLi9wZXRzL3J1YmJlcmR1Y2snO1xuaW1wb3J0IHsgU25ha2UgfSBmcm9tICcuL3BldHMvc25ha2UnO1xuaW1wb3J0IHsgVG90b3JvIH0gZnJvbSAnLi9wZXRzL3RvdG9ybyc7XG5pbXBvcnQgeyBaYXBweSB9IGZyb20gJy4vcGV0cy96YXBweSc7XG5pbXBvcnQgeyBSYXQgfSBmcm9tICcuL3BldHMvcmF0JztcbmltcG9ydCB7IFR1cnRsZSB9IGZyb20gJy4vcGV0cy90dXJ0bGUnO1xuaW1wb3J0IHsgSVBldFR5cGUgfSBmcm9tICcuL3N0YXRlcyc7XG5cbmV4cG9ydCBjbGFzcyBQZXRFbGVtZW50IHtcbiAgICBlbDogSFRNTEltYWdlRWxlbWVudDtcbiAgICBjb2xsaXNpb246IEhUTUxEaXZFbGVtZW50O1xuICAgIHNwZWVjaDogSFRNTERpdkVsZW1lbnQ7XG4gICAgcGV0OiBJUGV0VHlwZTtcbiAgICBjb2xvcjogUGV0Q29sb3I7XG4gICAgdHlwZTogUGV0VHlwZTtcbiAgICByZW1vdmUoKSB7XG4gICAgICAgIHRoaXMuZWwucmVtb3ZlKCk7XG4gICAgICAgIHRoaXMuY29sbGlzaW9uLnJlbW92ZSgpO1xuICAgICAgICB0aGlzLnNwZWVjaC5yZW1vdmUoKTtcbiAgICAgICAgdGhpcy5jb2xvciA9IFBldENvbG9yLm51bGw7XG4gICAgICAgIHRoaXMudHlwZSA9IFBldFR5cGUubnVsbDtcbiAgICB9XG5cbiAgICBjb25zdHJ1Y3RvcihcbiAgICAgICAgZWw6IEhUTUxJbWFnZUVsZW1lbnQsXG4gICAgICAgIGNvbGxpc2lvbjogSFRNTERpdkVsZW1lbnQsXG4gICAgICAgIHNwZWVjaDogSFRNTERpdkVsZW1lbnQsXG4gICAgICAgIHBldDogSVBldFR5cGUsXG4gICAgICAgIGNvbG9yOiBQZXRDb2xvcixcbiAgICAgICAgdHlwZTogUGV0VHlwZSxcbiAgICApIHtcbiAgICAgICAgdGhpcy5lbCA9IGVsO1xuICAgICAgICB0aGlzLmNvbGxpc2lvbiA9IGNvbGxpc2lvbjtcbiAgICAgICAgdGhpcy5zcGVlY2ggPSBzcGVlY2g7XG4gICAgICAgIHRoaXMucGV0ID0gcGV0O1xuICAgICAgICB0aGlzLmNvbG9yID0gY29sb3I7XG4gICAgICAgIHRoaXMudHlwZSA9IHR5cGU7XG4gICAgfVxufVxuXG5leHBvcnQgaW50ZXJmYWNlIElQZXRDb2xsZWN0aW9uIHtcbiAgICBwZXRzOiBBcnJheTxQZXRFbGVtZW50PjtcbiAgICBwdXNoKHBldDogUGV0RWxlbWVudCk6IHZvaWQ7XG4gICAgcmVzZXQoKTogdm9pZDtcbiAgICBzZWVrTmV3RnJpZW5kcygpOiBzdHJpbmdbXTtcbiAgICBsb2NhdGUobmFtZTogc3RyaW5nKTogUGV0RWxlbWVudCB8IHVuZGVmaW5lZDtcbiAgICByZW1vdmUobmFtZTogc3RyaW5nKTogdm9pZDtcbn1cblxuZXhwb3J0IGNsYXNzIFBldENvbGxlY3Rpb24gaW1wbGVtZW50cyBJUGV0Q29sbGVjdGlvbiB7XG4gICAgcHJpdmF0ZSBfcGV0czogQXJyYXk8UGV0RWxlbWVudD47XG5cbiAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICAgICAgdGhpcy5fcGV0cyA9IG5ldyBBcnJheSgwKTtcbiAgICB9XG5cbiAgICBwdWJsaWMgZ2V0IHBldHMoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9wZXRzO1xuICAgIH1cblxuICAgIHB1c2gocGV0OiBQZXRFbGVtZW50KSB7XG4gICAgICAgIHRoaXMuX3BldHMucHVzaChwZXQpO1xuICAgIH1cblxuICAgIHJlc2V0KCkge1xuICAgICAgICB0aGlzLl9wZXRzLmZvckVhY2goKHBldCkgPT4ge1xuICAgICAgICAgICAgcGV0LnJlbW92ZSgpO1xuICAgICAgICB9KTtcbiAgICAgICAgdGhpcy5fcGV0cyA9IFtdO1xuICAgIH1cblxuICAgIGxvY2F0ZShuYW1lOiBzdHJpbmcpOiBQZXRFbGVtZW50IHwgdW5kZWZpbmVkIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX3BldHMuZmluZCgoY29sbGVjdGlvbikgPT4ge1xuICAgICAgICAgICAgcmV0dXJuIGNvbGxlY3Rpb24ucGV0Lm5hbWUgPT09IG5hbWU7XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIHJlbW92ZShuYW1lOiBzdHJpbmcpOiBhbnkge1xuICAgICAgICB0aGlzLl9wZXRzLmZvckVhY2goKHBldCkgPT4ge1xuICAgICAgICAgICAgaWYgKHBldC5wZXQubmFtZSA9PT0gbmFtZSkge1xuICAgICAgICAgICAgICAgIHBldC5yZW1vdmUoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICAgIHRoaXMuX3BldHMgPSB0aGlzLl9wZXRzLmZpbHRlcigocGV0KSA9PiB7XG4gICAgICAgICAgICByZXR1cm4gcGV0LnBldC5uYW1lICE9PSBuYW1lO1xuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBzZWVrTmV3RnJpZW5kcygpOiBzdHJpbmdbXSB7XG4gICAgICAgIGlmICh0aGlzLl9wZXRzLmxlbmd0aCA8PSAxKSB7XG4gICAgICAgICAgICByZXR1cm4gW107XG4gICAgICAgIH0gLy8gWW91IGNhbid0IGJlIGZyaWVuZHMgd2l0aCB5b3Vyc2VsZi5cbiAgICAgICAgdmFyIG1lc3NhZ2VzID0gbmV3IEFycmF5PHN0cmluZz4oMCk7XG4gICAgICAgIHRoaXMuX3BldHMuZm9yRWFjaCgocGV0SW5Db2xsZWN0aW9uKSA9PiB7XG4gICAgICAgICAgICBpZiAocGV0SW5Db2xsZWN0aW9uLnBldC5oYXNGcmllbmQpIHtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9IC8vIEkgYWxyZWFkeSBoYXZlIGEgZnJpZW5kIVxuICAgICAgICAgICAgdGhpcy5fcGV0cy5mb3JFYWNoKChwb3RlbnRpYWxGcmllbmQpID0+IHtcbiAgICAgICAgICAgICAgICBpZiAocG90ZW50aWFsRnJpZW5kLnBldC5oYXNGcmllbmQpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgICAgIH0gLy8gQWxyZWFkeSBoYXMgYSBmcmllbmQuIHNvcnJ5LlxuICAgICAgICAgICAgICAgIGlmICghcG90ZW50aWFsRnJpZW5kLnBldC5jYW5DaGFzZSkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICAgICAgfSAvLyBQZXQgaXMgYnVzeSBkb2luZyBzb21ldGhpbmcgZWxzZS5cbiAgICAgICAgICAgICAgICBpZiAoXG4gICAgICAgICAgICAgICAgICAgIHBvdGVudGlhbEZyaWVuZC5wZXQubGVmdCA+IHBldEluQ29sbGVjdGlvbi5wZXQubGVmdCAmJlxuICAgICAgICAgICAgICAgICAgICBwb3RlbnRpYWxGcmllbmQucGV0LmxlZnQgPFxuICAgICAgICAgICAgICAgICAgICAgICAgcGV0SW5Db2xsZWN0aW9uLnBldC5sZWZ0ICsgcGV0SW5Db2xsZWN0aW9uLnBldC53aWR0aFxuICAgICAgICAgICAgICAgICkge1xuICAgICAgICAgICAgICAgICAgICAvLyBXZSBmb3VuZCBhIHBvc3NpYmxlIG5ldyBmcmllbmQuLlxuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcbiAgICAgICAgICAgICAgICAgICAgICAgIHBldEluQ29sbGVjdGlvbi5wZXQubmFtZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICcgd2FudHMgdG8gYmUgZnJpZW5kcyB3aXRoICcsXG4gICAgICAgICAgICAgICAgICAgICAgICBwb3RlbnRpYWxGcmllbmQucGV0Lm5hbWUsXG4gICAgICAgICAgICAgICAgICAgICAgICAnLicsXG4gICAgICAgICAgICAgICAgICAgICk7XG4gICAgICAgICAgICAgICAgICAgIGlmIChcbiAgICAgICAgICAgICAgICAgICAgICAgIHBldEluQ29sbGVjdGlvbi5wZXQubWFrZUZyaWVuZHNXaXRoKHBvdGVudGlhbEZyaWVuZC5wZXQpXG4gICAgICAgICAgICAgICAgICAgICkge1xuICAgICAgICAgICAgICAgICAgICAgICAgcG90ZW50aWFsRnJpZW5kLnBldC5zaG93U3BlZWNoQnViYmxlKCfinaTvuI8nLCAyMDAwKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHBldEluQ29sbGVjdGlvbi5wZXQuc2hvd1NwZWVjaEJ1YmJsZSgn4p2k77iPJywgMjAwMCk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG4gICAgICAgIHJldHVybiBtZXNzYWdlcztcbiAgICB9XG59XG5cbmV4cG9ydCBjbGFzcyBJbnZhbGlkUGV0RXhjZXB0aW9uIHtcbiAgICBtZXNzYWdlPzogc3RyaW5nO1xuXG4gICAgY29uc3RydWN0b3IobWVzc2FnZT86IHN0cmluZykge1xuICAgICAgICB0aGlzLm1lc3NhZ2UgPSBtZXNzYWdlO1xuICAgIH1cbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGNyZWF0ZVBldChcbiAgICBwZXRUeXBlOiBzdHJpbmcsXG4gICAgZWw6IEhUTUxJbWFnZUVsZW1lbnQsXG4gICAgY29sbGlzaW9uOiBIVE1MRGl2RWxlbWVudCxcbiAgICBzcGVlY2g6IEhUTUxEaXZFbGVtZW50LFxuICAgIHNpemU6IFBldFNpemUsXG4gICAgbGVmdDogbnVtYmVyLFxuICAgIGJvdHRvbTogbnVtYmVyLFxuICAgIHBldFJvb3Q6IHN0cmluZyxcbiAgICBmbG9vcjogbnVtYmVyLFxuICAgIG5hbWU6IHN0cmluZyxcbik6IElQZXRUeXBlIHtcbiAgICBpZiAobmFtZSA9PT0gdW5kZWZpbmVkIHx8IG5hbWUgPT09IG51bGwgfHwgbmFtZSA9PT0gJycpIHtcbiAgICAgICAgdGhyb3cgbmV3IEludmFsaWRQZXRFeGNlcHRpb24oJ25hbWUgaXMgdW5kZWZpbmVkJyk7XG4gICAgfVxuXG4gICAgY29uc3Qgc3RhbmRhcmRQZXRBcmd1bWVudHM6IFtcbiAgICAgICAgSFRNTEltYWdlRWxlbWVudCxcbiAgICAgICAgSFRNTERpdkVsZW1lbnQsXG4gICAgICAgIEhUTUxEaXZFbGVtZW50LFxuICAgICAgICBQZXRTaXplLFxuICAgICAgICBudW1iZXIsXG4gICAgICAgIG51bWJlcixcbiAgICAgICAgc3RyaW5nLFxuICAgICAgICBudW1iZXIsXG4gICAgICAgIHN0cmluZyxcbiAgICBdID0gW2VsLCBjb2xsaXNpb24sIHNwZWVjaCwgc2l6ZSwgbGVmdCwgYm90dG9tLCBwZXRSb290LCBmbG9vciwgbmFtZV07XG5cbiAgICBzd2l0Y2ggKHBldFR5cGUpIHtcbiAgICAgICAgY2FzZSBQZXRUeXBlLmNhdDpcbiAgICAgICAgICAgIHJldHVybiBuZXcgQ2F0KC4uLnN0YW5kYXJkUGV0QXJndW1lbnRzLCBQZXRTcGVlZC5ub3JtYWwpO1xuICAgICAgICBjYXNlIFBldFR5cGUuY2hpY2tlbjpcbiAgICAgICAgICAgIHJldHVybiBuZXcgQ2hpY2tlbiguLi5zdGFuZGFyZFBldEFyZ3VtZW50cywgUGV0U3BlZWQubm9ybWFsKTtcbiAgICAgICAgY2FzZSBQZXRUeXBlLmRvZzpcbiAgICAgICAgICAgIHJldHVybiBuZXcgRG9nKC4uLnN0YW5kYXJkUGV0QXJndW1lbnRzLCBQZXRTcGVlZC5ub3JtYWwpO1xuICAgICAgICBjYXNlIFBldFR5cGUuZm94OlxuICAgICAgICAgICAgcmV0dXJuIG5ldyBGb3goLi4uc3RhbmRhcmRQZXRBcmd1bWVudHMsIFBldFNwZWVkLmZhc3QpO1xuICAgICAgICBjYXNlIFBldFR5cGUuY3JhYjpcbiAgICAgICAgICAgIHJldHVybiBuZXcgQ3JhYiguLi5zdGFuZGFyZFBldEFyZ3VtZW50cywgUGV0U3BlZWQuc2xvdyk7XG4gICAgICAgIGNhc2UgUGV0VHlwZS5jbGlwcHk6XG4gICAgICAgICAgICByZXR1cm4gbmV3IENsaXBweSguLi5zdGFuZGFyZFBldEFyZ3VtZW50cywgUGV0U3BlZWQuc2xvdyk7XG4gICAgICAgIGNhc2UgUGV0VHlwZS5tb2Q6XG4gICAgICAgICAgICByZXR1cm4gbmV3IE1vZCguLi5zdGFuZGFyZFBldEFyZ3VtZW50cywgUGV0U3BlZWQubm9ybWFsKTtcbiAgICAgICAgY2FzZSBQZXRUeXBlLnRvdG9ybzpcbiAgICAgICAgICAgIHJldHVybiBuZXcgVG90b3JvKC4uLnN0YW5kYXJkUGV0QXJndW1lbnRzLCBQZXRTcGVlZC5ub3JtYWwpO1xuICAgICAgICBjYXNlIFBldFR5cGUuc25ha2U6XG4gICAgICAgICAgICByZXR1cm4gbmV3IFNuYWtlKC4uLnN0YW5kYXJkUGV0QXJndW1lbnRzLCBQZXRTcGVlZC52ZXJ5U2xvdyk7XG4gICAgICAgIGNhc2UgUGV0VHlwZS5ydWJiZXJkdWNrOlxuICAgICAgICAgICAgcmV0dXJuIG5ldyBSdWJiZXJEdWNrKC4uLnN0YW5kYXJkUGV0QXJndW1lbnRzLCBQZXRTcGVlZC5mYXN0KTtcbiAgICAgICAgY2FzZSBQZXRUeXBlLnphcHB5OlxuICAgICAgICAgICAgcmV0dXJuIG5ldyBaYXBweSguLi5zdGFuZGFyZFBldEFyZ3VtZW50cywgUGV0U3BlZWQudmVyeUZhc3QpO1xuICAgICAgICBjYXNlIFBldFR5cGUucm9ja3k6XG4gICAgICAgICAgICByZXR1cm4gbmV3IFJvY2t5KC4uLnN0YW5kYXJkUGV0QXJndW1lbnRzLCBQZXRTcGVlZC5zdGlsbCk7XG4gICAgICAgIGNhc2UgUGV0VHlwZS5jb2NrYXRpZWw6XG4gICAgICAgICAgICByZXR1cm4gbmV3IENvY2thdGllbCguLi5zdGFuZGFyZFBldEFyZ3VtZW50cywgUGV0U3BlZWQubm9ybWFsKTtcbiAgICAgICAgY2FzZSBQZXRUeXBlLnJhdDpcbiAgICAgICAgICAgIHJldHVybiBuZXcgUmF0KC4uLnN0YW5kYXJkUGV0QXJndW1lbnRzLCBQZXRTcGVlZC5ub3JtYWwpO1xuICAgICAgICBjYXNlIFBldFR5cGUudHVydGxlOlxuICAgICAgICAgICAgcmV0dXJuIG5ldyBUdXJ0bGUoLi4uc3RhbmRhcmRQZXRBcmd1bWVudHMsIFBldFNwZWVkLnZlcnlTbG93KTtcbiAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgIHRocm93IG5ldyBJbnZhbGlkUGV0RXhjZXB0aW9uKFwiUGV0IHR5cGUgZG9lc24ndCBleGlzdFwiKTtcbiAgICB9XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBhdmFpbGFibGVDb2xvcnMocGV0VHlwZTogUGV0VHlwZSk6IFBldENvbG9yW10ge1xuICAgIHN3aXRjaCAocGV0VHlwZSkge1xuICAgICAgICBjYXNlIFBldFR5cGUuY2F0OlxuICAgICAgICAgICAgcmV0dXJuIENhdC5wb3NzaWJsZUNvbG9ycztcbiAgICAgICAgY2FzZSBQZXRUeXBlLmNoaWNrZW46XG4gICAgICAgICAgICByZXR1cm4gQ2hpY2tlbi5wb3NzaWJsZUNvbG9ycztcbiAgICAgICAgY2FzZSBQZXRUeXBlLmRvZzpcbiAgICAgICAgICAgIHJldHVybiBEb2cucG9zc2libGVDb2xvcnM7XG4gICAgICAgIGNhc2UgUGV0VHlwZS5mb3g6XG4gICAgICAgICAgICByZXR1cm4gRm94LnBvc3NpYmxlQ29sb3JzO1xuICAgICAgICBjYXNlIFBldFR5cGUuY3JhYjpcbiAgICAgICAgICAgIHJldHVybiBDcmFiLnBvc3NpYmxlQ29sb3JzO1xuICAgICAgICBjYXNlIFBldFR5cGUuY2xpcHB5OlxuICAgICAgICAgICAgcmV0dXJuIENsaXBweS5wb3NzaWJsZUNvbG9ycztcbiAgICAgICAgY2FzZSBQZXRUeXBlLm1vZDpcbiAgICAgICAgICAgIHJldHVybiBNb2QucG9zc2libGVDb2xvcnM7XG4gICAgICAgIGNhc2UgUGV0VHlwZS50b3Rvcm86XG4gICAgICAgICAgICByZXR1cm4gVG90b3JvLnBvc3NpYmxlQ29sb3JzO1xuICAgICAgICBjYXNlIFBldFR5cGUuc25ha2U6XG4gICAgICAgICAgICByZXR1cm4gU25ha2UucG9zc2libGVDb2xvcnM7XG4gICAgICAgIGNhc2UgUGV0VHlwZS5ydWJiZXJkdWNrOlxuICAgICAgICAgICAgcmV0dXJuIFJ1YmJlckR1Y2sucG9zc2libGVDb2xvcnM7XG4gICAgICAgIGNhc2UgUGV0VHlwZS56YXBweTpcbiAgICAgICAgICAgIHJldHVybiBaYXBweS5wb3NzaWJsZUNvbG9ycztcbiAgICAgICAgY2FzZSBQZXRUeXBlLnJvY2t5OlxuICAgICAgICAgICAgcmV0dXJuIFJvY2t5LnBvc3NpYmxlQ29sb3JzO1xuICAgICAgICBjYXNlIFBldFR5cGUuY29ja2F0aWVsOlxuICAgICAgICAgICAgcmV0dXJuIENvY2thdGllbC5wb3NzaWJsZUNvbG9ycztcbiAgICAgICAgY2FzZSBQZXRUeXBlLnJhdDpcbiAgICAgICAgICAgIHJldHVybiBSYXQucG9zc2libGVDb2xvcnM7XG4gICAgICAgIGNhc2UgUGV0VHlwZS50dXJ0bGU6XG4gICAgICAgICAgICByZXR1cm4gVHVydGxlLnBvc3NpYmxlQ29sb3JzO1xuICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgdGhyb3cgbmV3IEludmFsaWRQZXRFeGNlcHRpb24oXCJQZXQgdHlwZSBkb2Vzbid0IGV4aXN0XCIpO1xuICAgIH1cbn1cblxuLyoqXG4gKiBTb21lIHBldHMgY2FuIG9ubHkgaGF2ZSBjZXJ0YWluIGNvbG9ycywgdGhpcyBtYWtlcyBzdXJlIHRoZXkgaGF2ZW4ndCBiZWVuIG1pc2NvbmZpZ3VyZWQuXG4gKiBAcGFyYW0gcGV0Q29sb3JcbiAqIEBwYXJhbSBwZXRUeXBlXG4gKiBAcmV0dXJucyBub3JtYWxpemVkIGNvbG9yXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBub3JtYWxpemVDb2xvcihwZXRDb2xvcjogUGV0Q29sb3IsIHBldFR5cGU6IFBldFR5cGUpOiBQZXRDb2xvciB7XG4gICAgY29uc3QgY29sb3JzID0gYXZhaWxhYmxlQ29sb3JzKHBldFR5cGUpO1xuICAgIGlmIChjb2xvcnMuaW5jbHVkZXMocGV0Q29sb3IpKSB7XG4gICAgICAgIHJldHVybiBwZXRDb2xvcjtcbiAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4gY29sb3JzWzBdO1xuICAgIH1cbn1cbiIsImltcG9ydCB7IFBldENvbG9yIH0gZnJvbSAnLi4vLi4vY29tbW9uL3R5cGVzJztcbmltcG9ydCB7IEJhc2VQZXRUeXBlIH0gZnJvbSAnLi4vYmFzZXBldHR5cGUnO1xuaW1wb3J0IHsgU3RhdGVzIH0gZnJvbSAnLi4vc3RhdGVzJztcblxuZXhwb3J0IGNsYXNzIENhdCBleHRlbmRzIEJhc2VQZXRUeXBlIHtcbiAgICBsYWJlbCA9ICdjYXQnO1xuICAgIHN0YXRpYyBwb3NzaWJsZUNvbG9ycyA9IFtcbiAgICAgICAgUGV0Q29sb3IuYmxhY2ssXG4gICAgICAgIFBldENvbG9yLmJyb3duLFxuICAgICAgICBQZXRDb2xvci53aGl0ZSxcbiAgICAgICAgUGV0Q29sb3IuZ3JheSxcbiAgICAgICAgUGV0Q29sb3IubGlnaHRicm93bixcbiAgICBdO1xuICAgIHNlcXVlbmNlID0ge1xuICAgICAgICBzdGFydGluZ1N0YXRlOiBTdGF0ZXMuc2l0SWRsZSxcbiAgICAgICAgc2VxdWVuY2VTdGF0ZXM6IFtcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBzdGF0ZTogU3RhdGVzLnNpdElkbGUsXG4gICAgICAgICAgICAgICAgcG9zc2libGVOZXh0U3RhdGVzOiBbU3RhdGVzLndhbGtSaWdodCwgU3RhdGVzLnJ1blJpZ2h0XSxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgc3RhdGU6IFN0YXRlcy53YWxrUmlnaHQsXG4gICAgICAgICAgICAgICAgcG9zc2libGVOZXh0U3RhdGVzOiBbU3RhdGVzLndhbGtMZWZ0LCBTdGF0ZXMucnVuTGVmdF0sXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIHN0YXRlOiBTdGF0ZXMucnVuUmlnaHQsXG4gICAgICAgICAgICAgICAgcG9zc2libGVOZXh0U3RhdGVzOiBbU3RhdGVzLndhbGtMZWZ0LCBTdGF0ZXMucnVuTGVmdF0sXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIHN0YXRlOiBTdGF0ZXMud2Fsa0xlZnQsXG4gICAgICAgICAgICAgICAgcG9zc2libGVOZXh0U3RhdGVzOiBbXG4gICAgICAgICAgICAgICAgICAgIFN0YXRlcy5zaXRJZGxlLFxuICAgICAgICAgICAgICAgICAgICBTdGF0ZXMuY2xpbWJXYWxsTGVmdCxcbiAgICAgICAgICAgICAgICAgICAgU3RhdGVzLndhbGtSaWdodCxcbiAgICAgICAgICAgICAgICAgICAgU3RhdGVzLnJ1blJpZ2h0LFxuICAgICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIHN0YXRlOiBTdGF0ZXMucnVuTGVmdCxcbiAgICAgICAgICAgICAgICBwb3NzaWJsZU5leHRTdGF0ZXM6IFtcbiAgICAgICAgICAgICAgICAgICAgU3RhdGVzLnNpdElkbGUsXG4gICAgICAgICAgICAgICAgICAgIFN0YXRlcy5jbGltYldhbGxMZWZ0LFxuICAgICAgICAgICAgICAgICAgICBTdGF0ZXMud2Fsa1JpZ2h0LFxuICAgICAgICAgICAgICAgICAgICBTdGF0ZXMucnVuUmlnaHQsXG4gICAgICAgICAgICAgICAgXSxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgc3RhdGU6IFN0YXRlcy5jbGltYldhbGxMZWZ0LFxuICAgICAgICAgICAgICAgIHBvc3NpYmxlTmV4dFN0YXRlczogW1N0YXRlcy53YWxsSGFuZ0xlZnRdLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBzdGF0ZTogU3RhdGVzLndhbGxIYW5nTGVmdCxcbiAgICAgICAgICAgICAgICBwb3NzaWJsZU5leHRTdGF0ZXM6IFtTdGF0ZXMuanVtcERvd25MZWZ0XSxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgc3RhdGU6IFN0YXRlcy5qdW1wRG93bkxlZnQsXG4gICAgICAgICAgICAgICAgcG9zc2libGVOZXh0U3RhdGVzOiBbU3RhdGVzLmxhbmRdLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBzdGF0ZTogU3RhdGVzLmxhbmQsXG4gICAgICAgICAgICAgICAgcG9zc2libGVOZXh0U3RhdGVzOiBbXG4gICAgICAgICAgICAgICAgICAgIFN0YXRlcy5zaXRJZGxlLFxuICAgICAgICAgICAgICAgICAgICBTdGF0ZXMud2Fsa1JpZ2h0LFxuICAgICAgICAgICAgICAgICAgICBTdGF0ZXMucnVuUmlnaHQsXG4gICAgICAgICAgICAgICAgXSxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgc3RhdGU6IFN0YXRlcy5jaGFzZSxcbiAgICAgICAgICAgICAgICBwb3NzaWJsZU5leHRTdGF0ZXM6IFtTdGF0ZXMuaWRsZVdpdGhCYWxsXSxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgc3RhdGU6IFN0YXRlcy5pZGxlV2l0aEJhbGwsXG4gICAgICAgICAgICAgICAgcG9zc2libGVOZXh0U3RhdGVzOiBbXG4gICAgICAgICAgICAgICAgICAgIFN0YXRlcy53YWxrUmlnaHQsXG4gICAgICAgICAgICAgICAgICAgIFN0YXRlcy53YWxrTGVmdCxcbiAgICAgICAgICAgICAgICAgICAgU3RhdGVzLnJ1bkxlZnQsXG4gICAgICAgICAgICAgICAgICAgIFN0YXRlcy5ydW5SaWdodCxcbiAgICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgXSxcbiAgICB9O1xuICAgIGdldCBlbW9qaSgpOiBzdHJpbmcge1xuICAgICAgICByZXR1cm4gJ/CfkLEnO1xuICAgIH1cbiAgICBnZXQgaGVsbG8oKTogc3RyaW5nIHtcbiAgICAgICAgcmV0dXJuIGBicnJyLi4uIE1lb3chYDtcbiAgICB9XG59XG5cbmV4cG9ydCBjb25zdCBDQVRfTkFNRVM6IFJlYWRvbmx5QXJyYXk8c3RyaW5nPiA9IFtcbiAgICAnQmVsbGEnLFxuICAgICdDaGFybGllJyxcbiAgICAnTW9sbHknLFxuICAgICdDb2NvJyxcbiAgICAnUnVieScsXG4gICAgJ09zY2FyJyxcbiAgICAnTHVjeScsXG4gICAgJ0JhaWxleScsXG4gICAgJ01pbG8nLFxuICAgICdEYWlzeScsXG4gICAgJ0FyY2hpZScsXG4gICAgJ09sbGllJyxcbiAgICAnUm9zaWUnLFxuICAgICdMb2xhJyxcbiAgICAnRnJhbmtpZScsXG4gICAgJ1JveHknLFxuICAgICdQb3BweScsXG4gICAgJ0x1bmEnLFxuICAgICdKYWNrJyxcbiAgICAnTWlsbGllJyxcbiAgICAnVGVkZHknLFxuICAgICdDb29wZXInLFxuICAgICdCZWFyJyxcbiAgICAnUm9ja3knLFxuICAgICdBbGZpZScsXG4gICAgJ0h1Z28nLFxuICAgICdCb25uaWUnLFxuICAgICdQZXBwZXInLFxuICAgICdMaWx5JyxcbiAgICAnVGlsbHknLFxuICAgICdMZW8nLFxuICAgICdNYWdnaWUnLFxuICAgICdHZW9yZ2UnLFxuICAgICdNaWEnLFxuICAgICdNYXJsZXknLFxuICAgICdIYXJsZXknLFxuICAgICdDaGxvZScsXG4gICAgJ0x1bHUnLFxuICAgICdNaXNzeScsXG4gICAgJ0phc3BlcicsXG4gICAgJ0JpbGx5JyxcbiAgICAnTmFsYScsXG4gICAgJ01vbnR5JyxcbiAgICAnWmlnZ3knLFxuICAgICdXaW5zdG9uJyxcbiAgICAnWmV1cycsXG4gICAgJ1pvZScsXG4gICAgJ1N0ZWxsYScsXG4gICAgJ1Nhc2hhJyxcbiAgICAnUnVzdHknLFxuICAgICdHdXMnLFxuICAgICdCYXh0ZXInLFxuICAgICdEZXh0ZXInLFxuICAgICdXaWxsb3cnLFxuICAgICdCYXJuZXknLFxuICAgICdCcnVubycsXG4gICAgJ1Blbm55JyxcbiAgICAnSG9uZXknLFxuICAgICdNaWxseScsXG4gICAgJ011cnBoeScsXG4gICAgJ1NpbWJhJyxcbiAgICAnSG9sbHknLFxuICAgICdCZW5qaScsXG4gICAgJ0hlbnJ5JyxcbiAgICAnTGlsbHknLFxuICAgICdQaXBwYScsXG4gICAgJ1NoYWRvdycsXG4gICAgJ1NhbScsXG4gICAgJ0x1Y2t5JyxcbiAgICAnRWxsaWUnLFxuICAgICdEdWtlJyxcbiAgICAnSmVzc2llJyxcbiAgICAnQ29va2llJyxcbiAgICAnSGFydmV5JyxcbiAgICAnQnJ1Y2UnLFxuICAgICdKYXgnLFxuICAgICdSZXgnLFxuICAgICdMb3VpZScsXG4gICAgJ0pldCcsXG4gICAgJ0JhbmpvJyxcbiAgICAnQmVhdScsXG4gICAgJ0VsbGEnLFxuICAgICdSYWxwaCcsXG4gICAgJ0xva2knLFxuICAgICdMZXhpJyxcbiAgICAnQ2hlc3RlcicsXG4gICAgJ1NvcGhpZScsXG4gICAgJ0NoaWxsaScsXG4gICAgJ0JpbGxpZScsXG4gICAgJ0xvdWlzJyxcbiAgICAnU2NvdXQnLFxuICAgICdDbGVvJyxcbiAgICAnUHVyZmVjdCcsXG4gICAgJ1Nwb3QnLFxuICAgICdCb2x0JyxcbiAgICAnSnVsaWEnLFxuICAgICdHaW5nZXInLFxuICAgICdEYWlzeScsXG4gICAgJ0FtZWxpYScsXG4gICAgJ09saXZlcicsXG4gICAgJ0dob3N0JyxcbiAgICAnTWlkbmlnaHQnLFxuICAgICdQdW1wa2luJyxcbiAgICAnU2hhZG93JyxcbiAgICAnQmlueCcsXG4gICAgJ1JpbGV5JyxcbiAgICAnTGVubnknLFxuICAgICdNYW5nbycsXG4gICAgJ0FsZXgnLFxuICAgICdCb28nLFxuICAgICdCb3RhcycsXG4gICAgJ1JvbWVvJyxcbiAgICAnQm9iJyxcbiAgICAnQ2x5ZGUnLFxuICAgICdTaW1vbicsXG4gICAgJ01pbW1vJyxcbiAgICAnQ2FybG90dGEnLFxuICAgICdGZWxpeCcsXG4gICAgJ0R1Y2hlc3MnLFxuXTtcbiIsImltcG9ydCB7IFBldENvbG9yIH0gZnJvbSAnLi4vLi4vY29tbW9uL3R5cGVzJztcbmltcG9ydCB7IEJhc2VQZXRUeXBlIH0gZnJvbSAnLi4vYmFzZXBldHR5cGUnO1xuaW1wb3J0IHsgU3RhdGVzIH0gZnJvbSAnLi4vc3RhdGVzJztcblxuZXhwb3J0IGNsYXNzIENoaWNrZW4gZXh0ZW5kcyBCYXNlUGV0VHlwZSB7XG4gICAgbGFiZWwgPSAnY2hpY2tlbic7XG4gICAgc3RhdGljIHBvc3NpYmxlQ29sb3JzID0gW1BldENvbG9yLndoaXRlXTtcbiAgICBzZXF1ZW5jZSA9IHtcbiAgICAgICAgc3RhcnRpbmdTdGF0ZTogU3RhdGVzLnNpdElkbGUsXG4gICAgICAgIHNlcXVlbmNlU3RhdGVzOiBbXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgc3RhdGU6IFN0YXRlcy5zaXRJZGxlLFxuICAgICAgICAgICAgICAgIHBvc3NpYmxlTmV4dFN0YXRlczogW1xuICAgICAgICAgICAgICAgICAgICBTdGF0ZXMud2Fsa1JpZ2h0LFxuICAgICAgICAgICAgICAgICAgICBTdGF0ZXMucnVuUmlnaHQsXG4gICAgICAgICAgICAgICAgICAgIFN0YXRlcy5zd2lwZSxcbiAgICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBzdGF0ZTogU3RhdGVzLndhbGtSaWdodCxcbiAgICAgICAgICAgICAgICBwb3NzaWJsZU5leHRTdGF0ZXM6IFtTdGF0ZXMud2Fsa0xlZnQsIFN0YXRlcy5ydW5MZWZ0XSxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgc3RhdGU6IFN0YXRlcy5ydW5SaWdodCxcbiAgICAgICAgICAgICAgICBwb3NzaWJsZU5leHRTdGF0ZXM6IFtTdGF0ZXMud2Fsa0xlZnQsIFN0YXRlcy5ydW5MZWZ0XSxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgc3RhdGU6IFN0YXRlcy53YWxrTGVmdCxcbiAgICAgICAgICAgICAgICBwb3NzaWJsZU5leHRTdGF0ZXM6IFtTdGF0ZXMuc2l0SWRsZV0sXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIHN0YXRlOiBTdGF0ZXMucnVuTGVmdCxcbiAgICAgICAgICAgICAgICBwb3NzaWJsZU5leHRTdGF0ZXM6IFtTdGF0ZXMuc2l0SWRsZV0sXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIHN0YXRlOiBTdGF0ZXMuY2hhc2UsXG4gICAgICAgICAgICAgICAgcG9zc2libGVOZXh0U3RhdGVzOiBbU3RhdGVzLmlkbGVXaXRoQmFsbF0sXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIHN0YXRlOiBTdGF0ZXMuc3dpcGUsXG4gICAgICAgICAgICAgICAgcG9zc2libGVOZXh0U3RhdGVzOiBbU3RhdGVzLnNpdElkbGVdLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBzdGF0ZTogU3RhdGVzLmlkbGVXaXRoQmFsbCxcbiAgICAgICAgICAgICAgICBwb3NzaWJsZU5leHRTdGF0ZXM6IFtcbiAgICAgICAgICAgICAgICAgICAgU3RhdGVzLndhbGtSaWdodCxcbiAgICAgICAgICAgICAgICAgICAgU3RhdGVzLndhbGtMZWZ0LFxuICAgICAgICAgICAgICAgICAgICBTdGF0ZXMucnVuTGVmdCxcbiAgICAgICAgICAgICAgICAgICAgU3RhdGVzLnJ1blJpZ2h0LFxuICAgICAgICAgICAgICAgICAgICBTdGF0ZXMuc3dpcGUsXG4gICAgICAgICAgICAgICAgXSxcbiAgICAgICAgICAgIH0sXG4gICAgICAgIF0sXG4gICAgfTtcbiAgICBnZXQgZW1vamkoKTogc3RyaW5nIHtcbiAgICAgICAgcmV0dXJuICfwn5CUJztcbiAgICB9XG4gICAgZ2V0IGhlbGxvKCk6IHN0cmluZyB7XG4gICAgICAgIHJldHVybiBgIFB1ayBQdWsgUHVrYWFhayAtIGp1c3QgbGV0IG1lIGxheSBteSBlZ2cuIPCfpZpgO1xuICAgIH1cbn1cblxuZXhwb3J0IGNvbnN0IENISUNLRU5fTkFNRVM6IFJlYWRvbmx5QXJyYXk8c3RyaW5nPiA9IFtcbiAgICAnSGVuIFNvbG8nLFxuICAgICdDbHVjayBWYWRlcicsXG4gICAgJ09iaSBXYW4gSGVub2JpJyxcbiAgICAnQWxiZXJ0IEVnZ3N0ZWluJyxcbiAgICAnQWJyYWhlbiBMaW5jb2xuJyxcbiAgICAnQ2x1Y2sgTm9ycmlzJyxcbiAgICAnU2lyIENsdWNrcy1BLUxvdCcsXG4gICAgJ0ZyYW5rLWhlbi1zdGVpbicsXG4gICAgJ1JpY2hhcmQnLFxuICAgICdEaXhpJyxcbiAgICAnTnVnZ2V0JyxcbiAgICAnQmVsbGEnLFxuICAgICdDb3R0b24nLFxuICAgICdQaXAnLFxuICAgICdMdWNreScsXG4gICAgJ1BvbGx5JyxcbiAgICAnTWlyYWJlbCcsXG4gICAgJ0Vsc2EnLFxuICAgICdCb24tQm9uJyxcbiAgICAnUnVieScsXG4gICAgJ1Jvc2llJyxcbiAgICAnVGVyaXlha2knLFxuICAgICdQZW5ndWluJyxcbiAgICAnU3liaWwnLFxuXTtcbiIsImltcG9ydCB7IFBldENvbG9yIH0gZnJvbSAnLi4vLi4vY29tbW9uL3R5cGVzJztcbmltcG9ydCB7IEJhc2VQZXRUeXBlIH0gZnJvbSAnLi4vYmFzZXBldHR5cGUnO1xuaW1wb3J0IHsgU3RhdGVzIH0gZnJvbSAnLi4vc3RhdGVzJztcblxuZXhwb3J0IGNsYXNzIENsaXBweSBleHRlbmRzIEJhc2VQZXRUeXBlIHtcbiAgICBsYWJlbCA9ICdjbGlwcHknO1xuICAgIHN0YXRpYyBwb3NzaWJsZUNvbG9ycyA9IFtcbiAgICAgICAgUGV0Q29sb3IuYmxhY2ssXG4gICAgICAgIFBldENvbG9yLmJyb3duLFxuICAgICAgICBQZXRDb2xvci5ncmVlbixcbiAgICAgICAgUGV0Q29sb3IueWVsbG93LFxuICAgIF07XG4gICAgc2VxdWVuY2UgPSB7XG4gICAgICAgIHN0YXJ0aW5nU3RhdGU6IFN0YXRlcy5zaXRJZGxlLFxuICAgICAgICBzZXF1ZW5jZVN0YXRlczogW1xuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIHN0YXRlOiBTdGF0ZXMuc2l0SWRsZSxcbiAgICAgICAgICAgICAgICBwb3NzaWJsZU5leHRTdGF0ZXM6IFtTdGF0ZXMud2Fsa1JpZ2h0LCBTdGF0ZXMucnVuUmlnaHRdLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBzdGF0ZTogU3RhdGVzLndhbGtSaWdodCxcbiAgICAgICAgICAgICAgICBwb3NzaWJsZU5leHRTdGF0ZXM6IFtTdGF0ZXMud2Fsa0xlZnQsIFN0YXRlcy5ydW5MZWZ0XSxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgc3RhdGU6IFN0YXRlcy5ydW5SaWdodCxcbiAgICAgICAgICAgICAgICBwb3NzaWJsZU5leHRTdGF0ZXM6IFtTdGF0ZXMud2Fsa0xlZnQsIFN0YXRlcy5ydW5MZWZ0XSxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgc3RhdGU6IFN0YXRlcy53YWxrTGVmdCxcbiAgICAgICAgICAgICAgICBwb3NzaWJsZU5leHRTdGF0ZXM6IFtTdGF0ZXMuc2l0SWRsZV0sXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIHN0YXRlOiBTdGF0ZXMucnVuTGVmdCxcbiAgICAgICAgICAgICAgICBwb3NzaWJsZU5leHRTdGF0ZXM6IFtTdGF0ZXMuc2l0SWRsZV0sXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIHN0YXRlOiBTdGF0ZXMuY2hhc2UsXG4gICAgICAgICAgICAgICAgcG9zc2libGVOZXh0U3RhdGVzOiBbU3RhdGVzLmlkbGVXaXRoQmFsbF0sXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIHN0YXRlOiBTdGF0ZXMuaWRsZVdpdGhCYWxsLFxuICAgICAgICAgICAgICAgIHBvc3NpYmxlTmV4dFN0YXRlczogW1xuICAgICAgICAgICAgICAgICAgICBTdGF0ZXMud2Fsa1JpZ2h0LFxuICAgICAgICAgICAgICAgICAgICBTdGF0ZXMud2Fsa0xlZnQsXG4gICAgICAgICAgICAgICAgICAgIFN0YXRlcy5ydW5MZWZ0LFxuICAgICAgICAgICAgICAgICAgICBTdGF0ZXMucnVuUmlnaHQsXG4gICAgICAgICAgICAgICAgXSxcbiAgICAgICAgICAgIH0sXG4gICAgICAgIF0sXG4gICAgfTtcbiAgICBnZXQgZW1vamkoKTogc3RyaW5nIHtcbiAgICAgICAgcmV0dXJuICfwn5OOJztcbiAgICB9XG4gICAgZ2V0IGhlbGxvKCk6IHN0cmluZyB7XG4gICAgICAgIHJldHVybiBgIEhpLCBJJ20gQ2xpcHB5LCB3b3VsZCB5b3UgbGlrZSBzb21lIGFzc2lzdGFuY2UgdG9kYXk/IPCfkYshYDtcbiAgICB9XG59XG5cbmV4cG9ydCBjb25zdCBDTElQUFlfTkFNRVM6IFJlYWRvbmx5QXJyYXk8c3RyaW5nPiA9IFtcbiAgICAnQ2xpcHB5JyxcbiAgICAnS2FybCBLbGFtbWVyJyxcbiAgICAnQ2xpcHB5IEpyLicsXG4gICAgJ01vbGx5JyxcbiAgICAnQ29jbycsXG4gICAgJ0J1ZGR5JyxcbiAgICAnUnVieScsXG4gICAgJ09zY2FyJyxcbiAgICAnTHVjeScsXG4gICAgJ0JhaWxleScsXG5dO1xuIiwiaW1wb3J0IHsgUGV0Q29sb3IgfSBmcm9tICcuLi8uLi9jb21tb24vdHlwZXMnO1xuaW1wb3J0IHsgQmFzZVBldFR5cGUgfSBmcm9tICcuLi9iYXNlcGV0dHlwZSc7XG5pbXBvcnQgeyBTdGF0ZXMgfSBmcm9tICcuLi9zdGF0ZXMnO1xuXG5leHBvcnQgY2xhc3MgQ29ja2F0aWVsIGV4dGVuZHMgQmFzZVBldFR5cGUge1xuICAgIGxhYmVsID0gJ2NvY2thdGllbCc7XG4gICAgc3RhdGljIHBvc3NpYmxlQ29sb3JzID0gW1BldENvbG9yLmdyYXldO1xuICAgIHNlcXVlbmNlID0ge1xuICAgICAgICBzdGFydGluZ1N0YXRlOiBTdGF0ZXMuc2l0SWRsZSxcbiAgICAgICAgc2VxdWVuY2VTdGF0ZXM6IFtcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBzdGF0ZTogU3RhdGVzLnNpdElkbGUsXG4gICAgICAgICAgICAgICAgcG9zc2libGVOZXh0U3RhdGVzOiBbU3RhdGVzLndhbGtSaWdodCwgU3RhdGVzLnJ1blJpZ2h0XSxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgc3RhdGU6IFN0YXRlcy53YWxrUmlnaHQsXG4gICAgICAgICAgICAgICAgcG9zc2libGVOZXh0U3RhdGVzOiBbU3RhdGVzLndhbGtMZWZ0LCBTdGF0ZXMucnVuTGVmdF0sXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIHN0YXRlOiBTdGF0ZXMucnVuUmlnaHQsXG4gICAgICAgICAgICAgICAgcG9zc2libGVOZXh0U3RhdGVzOiBbU3RhdGVzLndhbGtMZWZ0LCBTdGF0ZXMucnVuTGVmdF0sXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIHN0YXRlOiBTdGF0ZXMud2Fsa0xlZnQsXG4gICAgICAgICAgICAgICAgcG9zc2libGVOZXh0U3RhdGVzOiBbU3RhdGVzLnNpdElkbGVdLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBzdGF0ZTogU3RhdGVzLnJ1bkxlZnQsXG4gICAgICAgICAgICAgICAgcG9zc2libGVOZXh0U3RhdGVzOiBbU3RhdGVzLnNpdElkbGVdLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBzdGF0ZTogU3RhdGVzLmNoYXNlLFxuICAgICAgICAgICAgICAgIHBvc3NpYmxlTmV4dFN0YXRlczogW1N0YXRlcy5pZGxlV2l0aEJhbGxdLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBzdGF0ZTogU3RhdGVzLmlkbGVXaXRoQmFsbCxcbiAgICAgICAgICAgICAgICBwb3NzaWJsZU5leHRTdGF0ZXM6IFtcbiAgICAgICAgICAgICAgICAgICAgU3RhdGVzLndhbGtSaWdodCxcbiAgICAgICAgICAgICAgICAgICAgU3RhdGVzLndhbGtMZWZ0LFxuICAgICAgICAgICAgICAgICAgICBTdGF0ZXMucnVuTGVmdCxcbiAgICAgICAgICAgICAgICAgICAgU3RhdGVzLnJ1blJpZ2h0LFxuICAgICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICB9LFxuICAgICAgICBdLFxuICAgIH07XG4gICAgZ2V0IGVtb2ppKCk6IHN0cmluZyB7XG4gICAgICAgIHJldHVybiAn8J+mnCc7XG4gICAgfVxuICAgIGdldCBoZWxsbygpOiBzdHJpbmcge1xuICAgICAgICAvLyBUT0RPOiAjMTkxIEFkZCBhIGN1c3RvbSBtZXNzYWdlIGZvciBjb2NrYXRpZWxcbiAgICAgICAgcmV0dXJuIGAgSGVsbG8sIEknbSBhIGdvb2QgYmlyZCDwn5GLIWA7XG4gICAgfVxufVxuXG5leHBvcnQgY29uc3QgQ09DS0FUSUVMX05BTUVTOiBSZWFkb25seUFycmF5PHN0cmluZz4gPSBbXG4gICAgJ0NvY2t0YWlsJyxcbiAgICAnUGlwc3F1ZWFrJyxcbiAgICAnU2lyIENoaXJwcyBhIExvdCcsXG4gICAgJ05pYmJsZXMnLFxuICAgICdMb3JkIG9mIHRoZSBXaW5ncycsXG4gICAgJ0dpcmwgTmVzdCBEb29yJyxcbiAgICAnV2luZ21hbicsXG4gICAgJ01lcnlsIENoZWVwJyxcbiAgICAnSmFjayBTcGFycm93JyxcbiAgICAnR29kZmVhdGhlcicsXG4gICAgJ01pY2tleScsXG4gICAgJ0JhcXVhY2sgT2JhbWEnLFxuICAgICdEYW1lIEp1ZGkgRmluY2gnLFxuICAgICdLYW55ZSBOZXN0JyxcbiAgICAnU3BlY2snLFxuICAgICdDaGVlY2t5JyxcbiAgICAnQXJ0aHVyJyxcbiAgICAnUGFjbycsXG4gICAgJ0JvYm8nLFxuICAgICdXYWx0JyxcbiAgICAnSGFwcHknLFxuICAgICdKdW5pb3InLFxuICAgICdDb2NvJyxcbiAgICAnWW95bycsXG4gICAgJ01pbG8nLFxuICAgICdTa2lwcGVyJyxcbiAgICAnU2NhcmxldCcsXG4gICAgJ0RpdmEnLFxuICAgICdVcnN1bGEnLFxuICAgICdEb25uYScsXG4gICAgJ0xvbGEnLFxuICAgICdLaWtvJyxcbiAgICAnTHVuYScsXG5dO1xuIiwiaW1wb3J0IHsgUGV0Q29sb3IgfSBmcm9tICcuLi8uLi9jb21tb24vdHlwZXMnO1xuaW1wb3J0IHsgQmFzZVBldFR5cGUgfSBmcm9tICcuLi9iYXNlcGV0dHlwZSc7XG5pbXBvcnQgeyBTdGF0ZXMgfSBmcm9tICcuLi9zdGF0ZXMnO1xuXG5leHBvcnQgY2xhc3MgQ3JhYiBleHRlbmRzIEJhc2VQZXRUeXBlIHtcbiAgICBsYWJlbCA9ICdjcmFiJztcbiAgICBzdGF0aWMgcG9zc2libGVDb2xvcnMgPSBbUGV0Q29sb3IucmVkXTtcbiAgICBzZXF1ZW5jZSA9IHtcbiAgICAgICAgc3RhcnRpbmdTdGF0ZTogU3RhdGVzLnNpdElkbGUsXG4gICAgICAgIHNlcXVlbmNlU3RhdGVzOiBbXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgc3RhdGU6IFN0YXRlcy5zaXRJZGxlLFxuICAgICAgICAgICAgICAgIHBvc3NpYmxlTmV4dFN0YXRlczogW1N0YXRlcy53YWxrUmlnaHQsIFN0YXRlcy5ydW5SaWdodF0sXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIHN0YXRlOiBTdGF0ZXMud2Fsa1JpZ2h0LFxuICAgICAgICAgICAgICAgIHBvc3NpYmxlTmV4dFN0YXRlczogW1N0YXRlcy53YWxrTGVmdCwgU3RhdGVzLnJ1bkxlZnRdLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBzdGF0ZTogU3RhdGVzLnJ1blJpZ2h0LFxuICAgICAgICAgICAgICAgIHBvc3NpYmxlTmV4dFN0YXRlczogW1N0YXRlcy53YWxrTGVmdCwgU3RhdGVzLnJ1bkxlZnRdLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBzdGF0ZTogU3RhdGVzLndhbGtMZWZ0LFxuICAgICAgICAgICAgICAgIHBvc3NpYmxlTmV4dFN0YXRlczogW1N0YXRlcy5zaXRJZGxlXSxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgc3RhdGU6IFN0YXRlcy5ydW5MZWZ0LFxuICAgICAgICAgICAgICAgIHBvc3NpYmxlTmV4dFN0YXRlczogW1N0YXRlcy5zaXRJZGxlXSxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgc3RhdGU6IFN0YXRlcy5jaGFzZSxcbiAgICAgICAgICAgICAgICBwb3NzaWJsZU5leHRTdGF0ZXM6IFtTdGF0ZXMuaWRsZVdpdGhCYWxsXSxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgc3RhdGU6IFN0YXRlcy5pZGxlV2l0aEJhbGwsXG4gICAgICAgICAgICAgICAgcG9zc2libGVOZXh0U3RhdGVzOiBbXG4gICAgICAgICAgICAgICAgICAgIFN0YXRlcy53YWxrUmlnaHQsXG4gICAgICAgICAgICAgICAgICAgIFN0YXRlcy53YWxrTGVmdCxcbiAgICAgICAgICAgICAgICAgICAgU3RhdGVzLnJ1bkxlZnQsXG4gICAgICAgICAgICAgICAgICAgIFN0YXRlcy5ydW5SaWdodCxcbiAgICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgXSxcbiAgICB9O1xuICAgIGdldCBlbW9qaSgpOiBzdHJpbmcge1xuICAgICAgICByZXR1cm4gJ/CfpoAnO1xuICAgIH1cbiAgICBnZXQgaGVsbG8oKTogc3RyaW5nIHtcbiAgICAgICAgcmV0dXJuIGAgSGksIEknbSBDcmFic29sdXRlbHkgQ2xhd3NvbWUgQ3JhYiDwn5GLIWA7XG4gICAgfVxufVxuXG5leHBvcnQgY29uc3QgQ1JBQl9OQU1FUzogUmVhZG9ubHlBcnJheTxzdHJpbmc+ID0gW1xuICAgICdGZXJyaXMnLFxuICAgICdQaW5jaHknLFxuICAgICdHcmFiYnknLFxuICAgICdCaWcgUmVkJyxcbiAgICAnQ3JhYmJ5JyxcbiAgICAnQnVkZHknLFxuICAgICdSdWJ5IFJlZCcsXG4gICAgJ09zY2FyJyxcbiAgICAnTHVjeScsXG4gICAgJ0JhaWxleScsXG4gICAgJ0NyYWJpdG8nLFxuICAgICdQZXJjeScsXG4gICAgJ1JvY2t5JyxcbiAgICAnTXIuIEtyYWJzJyxcbiAgICAnU2hlbGx5JyxcbiAgICAnU2FudGEgQ2xhd3MnLFxuICAgICdDbGF3ZGlhJyxcbiAgICAnU2N1dHRsZScsXG4gICAgJ1NuYXBweScsXG4gICAgJ0hlcm1pdCcsXG4gICAgJ0hvcnNlc2hvZScsXG4gICAgJ1NuYXBwZXInLFxuICAgICdDb2NvbnV0JyxcbiAgICAnU2ViYXN0aWFuJyxcbiAgICAnQWJieScsXG4gICAgJ0J1YmJsZXMnLFxuICAgICdCYWl0JyxcbiAgICAnQmlnIE1hYycsXG4gICAgJ0JpZ2dpZScsXG4gICAgJ0NsYXdzJyxcbiAgICAnQ29wcGVyJyxcbiAgICAnQ3JhYmV0dGUnLFxuICAgICdDcmFiaW5hJyxcbiAgICAnQ3JhYm1pc3RlcicsXG4gICAgJ0NydXN0eScsXG4gICAgJ0NyYWJjYWtlJyxcbiAgICAnRGlnZ2VyJyxcbiAgICAnTmlwcGVyJyxcbiAgICAnUGluY2VyJyxcbiAgICAnUG9vcHNpZScsXG4gICAgJ1JlY2x1c2UnLFxuICAgICdTYWx0eScsXG4gICAgJ1NxdWlydCcsXG4gICAgJ0dyb3VjaG8nLFxuICAgICdHcnVtcHknLFxuICAgICdMZW5ueSBLcmFiaXR6JyxcbiAgICAnTGVvbmFyZG8gRGFQaW5jaHknLFxuICAgICdQZWV2ZXMnLFxuICAgICdQZW5ueSBQaW5jaGVyJyxcbiAgICAnUHJpY2tsJyxcbl07XG4iLCJpbXBvcnQgeyBQZXRDb2xvciB9IGZyb20gJy4uLy4uL2NvbW1vbi90eXBlcyc7XG5pbXBvcnQgeyBCYXNlUGV0VHlwZSB9IGZyb20gJy4uL2Jhc2VwZXR0eXBlJztcbmltcG9ydCB7IFN0YXRlcyB9IGZyb20gJy4uL3N0YXRlcyc7XG5cbmV4cG9ydCBjbGFzcyBEb2cgZXh0ZW5kcyBCYXNlUGV0VHlwZSB7XG4gICAgbGFiZWwgPSAnZG9nJztcbiAgICBzdGF0aWMgcG9zc2libGVDb2xvcnMgPSBbXG4gICAgICAgIFBldENvbG9yLmJsYWNrLFxuICAgICAgICBQZXRDb2xvci5icm93bixcbiAgICAgICAgUGV0Q29sb3Iud2hpdGUsXG4gICAgICAgIFBldENvbG9yLnJlZCxcbiAgICAgICAgUGV0Q29sb3IuYWtpdGEsXG4gICAgXTtcbiAgICBzZXF1ZW5jZSA9IHtcbiAgICAgICAgc3RhcnRpbmdTdGF0ZTogU3RhdGVzLnNpdElkbGUsXG4gICAgICAgIHNlcXVlbmNlU3RhdGVzOiBbXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgc3RhdGU6IFN0YXRlcy5zaXRJZGxlLFxuICAgICAgICAgICAgICAgIHBvc3NpYmxlTmV4dFN0YXRlczogW1xuICAgICAgICAgICAgICAgICAgICBTdGF0ZXMud2Fsa1JpZ2h0LFxuICAgICAgICAgICAgICAgICAgICBTdGF0ZXMucnVuUmlnaHQsXG4gICAgICAgICAgICAgICAgICAgIFN0YXRlcy5saWUsXG4gICAgICAgICAgICAgICAgXSxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgc3RhdGU6IFN0YXRlcy5saWUsXG4gICAgICAgICAgICAgICAgcG9zc2libGVOZXh0U3RhdGVzOiBbU3RhdGVzLndhbGtSaWdodCwgU3RhdGVzLnJ1blJpZ2h0XSxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgc3RhdGU6IFN0YXRlcy53YWxrUmlnaHQsXG4gICAgICAgICAgICAgICAgcG9zc2libGVOZXh0U3RhdGVzOiBbU3RhdGVzLndhbGtMZWZ0LCBTdGF0ZXMucnVuTGVmdF0sXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIHN0YXRlOiBTdGF0ZXMucnVuUmlnaHQsXG4gICAgICAgICAgICAgICAgcG9zc2libGVOZXh0U3RhdGVzOiBbU3RhdGVzLndhbGtMZWZ0LCBTdGF0ZXMucnVuTGVmdF0sXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIHN0YXRlOiBTdGF0ZXMud2Fsa0xlZnQsXG4gICAgICAgICAgICAgICAgcG9zc2libGVOZXh0U3RhdGVzOiBbXG4gICAgICAgICAgICAgICAgICAgIFN0YXRlcy5zaXRJZGxlLFxuICAgICAgICAgICAgICAgICAgICBTdGF0ZXMubGllLFxuICAgICAgICAgICAgICAgICAgICBTdGF0ZXMud2Fsa1JpZ2h0LFxuICAgICAgICAgICAgICAgICAgICBTdGF0ZXMucnVuUmlnaHQsXG4gICAgICAgICAgICAgICAgXSxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgc3RhdGU6IFN0YXRlcy5ydW5MZWZ0LFxuICAgICAgICAgICAgICAgIHBvc3NpYmxlTmV4dFN0YXRlczogW1xuICAgICAgICAgICAgICAgICAgICBTdGF0ZXMuc2l0SWRsZSxcbiAgICAgICAgICAgICAgICAgICAgU3RhdGVzLmxpZSxcbiAgICAgICAgICAgICAgICAgICAgU3RhdGVzLndhbGtSaWdodCxcbiAgICAgICAgICAgICAgICAgICAgU3RhdGVzLnJ1blJpZ2h0LFxuICAgICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIHN0YXRlOiBTdGF0ZXMuY2hhc2UsXG4gICAgICAgICAgICAgICAgcG9zc2libGVOZXh0U3RhdGVzOiBbU3RhdGVzLmlkbGVXaXRoQmFsbF0sXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIHN0YXRlOiBTdGF0ZXMuaWRsZVdpdGhCYWxsLFxuICAgICAgICAgICAgICAgIHBvc3NpYmxlTmV4dFN0YXRlczogW1xuICAgICAgICAgICAgICAgICAgICBTdGF0ZXMud2Fsa1JpZ2h0LFxuICAgICAgICAgICAgICAgICAgICBTdGF0ZXMud2Fsa0xlZnQsXG4gICAgICAgICAgICAgICAgICAgIFN0YXRlcy5ydW5MZWZ0LFxuICAgICAgICAgICAgICAgICAgICBTdGF0ZXMucnVuUmlnaHQsXG4gICAgICAgICAgICAgICAgXSxcbiAgICAgICAgICAgIH0sXG4gICAgICAgIF0sXG4gICAgfTtcbiAgICBnZXQgZW1vamkoKTogc3RyaW5nIHtcbiAgICAgICAgcmV0dXJuICfwn5C2JztcbiAgICB9XG4gICAgZ2V0IGhlbGxvKCk6IHN0cmluZyB7XG4gICAgICAgIHJldHVybiBgIEV2ZXJ5IGRvZyBoYXMgaXRzIGRheSAtIGFuZCB0b2RheSBpcyB3b29mIGRheSEgVG9kYXkgSSBqdXN0IHdhbnQgdG8gYmFyay4gVGFrZSBtZSBvbiBhIHdhbGtgO1xuICAgIH1cbn1cblxuZXhwb3J0IGNvbnN0IERPR19OQU1FUzogUmVhZG9ubHlBcnJheTxzdHJpbmc+ID0gW1xuICAgICdCZWxsYScsXG4gICAgJ0NoYXJsaWUnLFxuICAgICdNYXgnLFxuICAgICdNb2xseScsXG4gICAgJ0NvY28nLFxuICAgICdCdWRkeScsXG4gICAgJ1J1YnknLFxuICAgICdPc2NhcicsXG4gICAgJ0x1Y3knLFxuICAgICdCYWlsZXknLFxuICAgICdNaWxvJyxcbiAgICAnRGFpc3knLFxuICAgICdBcmNoaWUnLFxuICAgICdPbGxpZScsXG4gICAgJ1Jvc2llJyxcbiAgICAnTG9sYScsXG4gICAgJ0ZyYW5raWUnLFxuICAgICdUb2J5JyxcbiAgICAnUm94eScsXG4gICAgJ1BvcHB5JyxcbiAgICAnTHVuYScsXG4gICAgJ0phY2snLFxuICAgICdNaWxsaWUnLFxuICAgICdUZWRkeScsXG4gICAgJ0hhcnJ5JyxcbiAgICAnQ29vcGVyJyxcbiAgICAnQmVhcicsXG4gICAgJ1JvY2t5JyxcbiAgICAnQWxmaWUnLFxuICAgICdIdWdvJyxcbiAgICAnQm9ubmllJyxcbiAgICAnUGVwcGVyJyxcbiAgICAnTGlseScsXG4gICAgJ0xlbycsXG4gICAgJ01hZ2dpZScsXG4gICAgJ0dlb3JnZScsXG4gICAgJ01pYScsXG4gICAgJ01hcmxleScsXG4gICAgJ0hhcmxleScsXG4gICAgJ0NobG9lJyxcbiAgICAnTHVsdScsXG4gICAgJ0phc3BlcicsXG4gICAgJ0JpbGx5JyxcbiAgICAnTmFsYScsXG4gICAgJ01vbnR5JyxcbiAgICAnWmlnZ3knLFxuICAgICdXaW5zdG9uJyxcbiAgICAnWmV1cycsXG4gICAgJ1pvZScsXG4gICAgJ1N0ZWxsYScsXG4gICAgJ1Nhc2hhJyxcbiAgICAnUnVzdHknLFxuICAgICdHdXMnLFxuICAgICdCYXh0ZXInLFxuICAgICdEZXh0ZXInLFxuICAgICdEaWVzZWwnLFxuICAgICdXaWxsb3cnLFxuICAgICdCYXJuZXknLFxuICAgICdCcnVubycsXG4gICAgJ1Blbm55JyxcbiAgICAnSG9uZXknLFxuICAgICdNaWxseScsXG4gICAgJ011cnBoeScsXG4gICAgJ0hvbGx5JyxcbiAgICAnQmVuamknLFxuICAgICdIZW5yeScsXG4gICAgJ0xpbGx5JyxcbiAgICAnUGlwcGEnLFxuICAgICdTaGFkb3cnLFxuICAgICdTYW0nLFxuICAgICdCdXN0ZXInLFxuICAgICdMdWNreScsXG4gICAgJ0VsbGllJyxcbiAgICAnRHVrZScsXG4gICAgJ0plc3NpZScsXG4gICAgJ0Nvb2tpZScsXG4gICAgJ0hhcnZleScsXG4gICAgJ0JydWNlJyxcbiAgICAnSmF4JyxcbiAgICAnUmV4JyxcbiAgICAnTG91aWUnLFxuICAgICdCZW50bGV5JyxcbiAgICAnSmV0JyxcbiAgICAnQmFuam8nLFxuICAgICdCZWF1JyxcbiAgICAnRWxsYScsXG4gICAgJ1JhbHBoJyxcbiAgICAnTG9raScsXG4gICAgJ0xleGknLFxuICAgICdDaGVzdGVyJyxcbiAgICAnU29waGllJyxcbiAgICAnQmlsbGllJyxcbiAgICAnTG91aXMnLFxuICAgICdDaGFybGllJyxcbiAgICAnQ2xlbycsXG4gICAgJ1Nwb3QnLFxuICAgICdIYXJyeScsXG4gICAgJ0JvbHQnLFxuICAgICdFaW4nLFxuICAgICdNYWRkeScsXG4gICAgJ0dob3N0JyxcbiAgICAnTWlkbmlnaHQnLFxuICAgICdQdW1wa2luJyxcbiAgICAnU2hhZG93JyxcbiAgICAnU3Bhcmt5JyxcbiAgICAnTGludXMnLFxuICAgICdDb2R5JyxcbiAgICAnU2xpbmt5JyxcbiAgICAnVG90bycsXG4gICAgJ0JhbHRvJyxcbiAgICAnR29sZm8nLFxuICAgICdQb25nbycsXG4gICAgJ0JlZXRob3ZlbicsXG4gICAgJ0hhY2hpa28nLFxuICAgICdTY29vYnknLFxuICAgICdDbGlmZm9yZCcsXG4gICAgJ0FzdHJvJyxcbiAgICAnR29vZnknLFxuICAgICdDaGlwJyxcbiAgICAnRWluc3RlaW4nLFxuICAgICdGYW5nJyxcbiAgICAnVHJ1bWFuJyxcbiAgICAnVWdnaWUnLFxuICAgICdCaW5nbycsXG4gICAgJ0JsdWUnLFxuICAgICdDb21ldGEnLFxuICAgICdLcnlwdG8nLFxuICAgICdIdWVzb3MnLFxuICAgICdPZGllJyxcbiAgICAnU25vb3B5JyxcbiAgICAnQWlzaGEnLFxuICAgICdNb2x5JyxcbiAgICAnQ2hpcXVpdGEnLFxuICAgICdDaGF2ZWxhJyxcbiAgICAnVHJhbXAnLFxuICAgICdMYWR5JyxcbiAgICAnUHVkZGxlcycsXG5dO1xuIiwiaW1wb3J0IHsgUGV0Q29sb3IgfSBmcm9tICcuLi8uLi9jb21tb24vdHlwZXMnO1xuaW1wb3J0IHsgQmFzZVBldFR5cGUgfSBmcm9tICcuLi9iYXNlcGV0dHlwZSc7XG5pbXBvcnQgeyBTdGF0ZXMgfSBmcm9tICcuLi9zdGF0ZXMnO1xuXG5leHBvcnQgY2xhc3MgRm94IGV4dGVuZHMgQmFzZVBldFR5cGUge1xuICAgIGxhYmVsID0gJ2ZveCc7XG4gICAgc3RhdGljIHBvc3NpYmxlQ29sb3JzID0gW1BldENvbG9yLnJlZCwgUGV0Q29sb3Iud2hpdGVdO1xuICAgIHNlcXVlbmNlID0ge1xuICAgICAgICBzdGFydGluZ1N0YXRlOiBTdGF0ZXMuc2l0SWRsZSxcbiAgICAgICAgc2VxdWVuY2VTdGF0ZXM6IFtcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBzdGF0ZTogU3RhdGVzLnNpdElkbGUsXG4gICAgICAgICAgICAgICAgcG9zc2libGVOZXh0U3RhdGVzOiBbXG4gICAgICAgICAgICAgICAgICAgIFN0YXRlcy5saWUsXG4gICAgICAgICAgICAgICAgICAgIFN0YXRlcy53YWxrUmlnaHQsXG4gICAgICAgICAgICAgICAgICAgIFN0YXRlcy53YWxrTGVmdCxcbiAgICAgICAgICAgICAgICAgICAgU3RhdGVzLnJ1blJpZ2h0LFxuICAgICAgICAgICAgICAgICAgICBTdGF0ZXMucnVuTGVmdCxcbiAgICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBzdGF0ZTogU3RhdGVzLmxpZSxcbiAgICAgICAgICAgICAgICBwb3NzaWJsZU5leHRTdGF0ZXM6IFtcbiAgICAgICAgICAgICAgICAgICAgU3RhdGVzLndhbGtSaWdodCxcbiAgICAgICAgICAgICAgICAgICAgU3RhdGVzLndhbGtMZWZ0LFxuICAgICAgICAgICAgICAgICAgICBTdGF0ZXMucnVuUmlnaHQsXG4gICAgICAgICAgICAgICAgICAgIFN0YXRlcy5ydW5MZWZ0LFxuICAgICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIHN0YXRlOiBTdGF0ZXMud2Fsa1JpZ2h0LFxuICAgICAgICAgICAgICAgIHBvc3NpYmxlTmV4dFN0YXRlczogW1xuICAgICAgICAgICAgICAgICAgICBTdGF0ZXMuc2l0SWRsZSxcbiAgICAgICAgICAgICAgICAgICAgU3RhdGVzLndhbGtMZWZ0LFxuICAgICAgICAgICAgICAgICAgICBTdGF0ZXMucnVuTGVmdCxcbiAgICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBzdGF0ZTogU3RhdGVzLndhbGtMZWZ0LFxuICAgICAgICAgICAgICAgIHBvc3NpYmxlTmV4dFN0YXRlczogW1xuICAgICAgICAgICAgICAgICAgICBTdGF0ZXMuc2l0SWRsZSxcbiAgICAgICAgICAgICAgICAgICAgU3RhdGVzLndhbGtSaWdodCxcbiAgICAgICAgICAgICAgICAgICAgU3RhdGVzLnJ1blJpZ2h0LFxuICAgICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIHN0YXRlOiBTdGF0ZXMucnVuUmlnaHQsXG4gICAgICAgICAgICAgICAgcG9zc2libGVOZXh0U3RhdGVzOiBbXG4gICAgICAgICAgICAgICAgICAgIFN0YXRlcy5saWUsXG4gICAgICAgICAgICAgICAgICAgIFN0YXRlcy5zaXRJZGxlLFxuICAgICAgICAgICAgICAgICAgICBTdGF0ZXMud2Fsa0xlZnQsXG4gICAgICAgICAgICAgICAgICAgIFN0YXRlcy5ydW5MZWZ0LFxuICAgICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIHN0YXRlOiBTdGF0ZXMucnVuTGVmdCxcbiAgICAgICAgICAgICAgICBwb3NzaWJsZU5leHRTdGF0ZXM6IFtcbiAgICAgICAgICAgICAgICAgICAgU3RhdGVzLmxpZSxcbiAgICAgICAgICAgICAgICAgICAgU3RhdGVzLnNpdElkbGUsXG4gICAgICAgICAgICAgICAgICAgIFN0YXRlcy53YWxrUmlnaHQsXG4gICAgICAgICAgICAgICAgICAgIFN0YXRlcy5ydW5SaWdodCxcbiAgICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBzdGF0ZTogU3RhdGVzLmNoYXNlLFxuICAgICAgICAgICAgICAgIHBvc3NpYmxlTmV4dFN0YXRlczogW1N0YXRlcy5pZGxlV2l0aEJhbGxdLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBzdGF0ZTogU3RhdGVzLmlkbGVXaXRoQmFsbCxcbiAgICAgICAgICAgICAgICBwb3NzaWJsZU5leHRTdGF0ZXM6IFtcbiAgICAgICAgICAgICAgICAgICAgU3RhdGVzLmxpZSxcbiAgICAgICAgICAgICAgICAgICAgU3RhdGVzLndhbGtSaWdodCxcbiAgICAgICAgICAgICAgICAgICAgU3RhdGVzLndhbGtMZWZ0LFxuICAgICAgICAgICAgICAgICAgICBTdGF0ZXMucnVuUmlnaHQsXG4gICAgICAgICAgICAgICAgICAgIFN0YXRlcy5ydW5MZWZ0LFxuICAgICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICB9LFxuICAgICAgICBdLFxuICAgIH07XG4gICAgZ2V0IGVtb2ppKCk6IHN0cmluZyB7XG4gICAgICAgIHJldHVybiAn8J+miic7XG4gICAgfVxuICAgIGdldCBoZWxsbygpOiBzdHJpbmcge1xuICAgICAgICByZXR1cm4gYGZveCBzYXlzIGhlbGxvYDtcbiAgICB9XG59XG5cbmV4cG9ydCBjb25zdCBGT1hfTkFNRVM6IFJlYWRvbmx5QXJyYXk8c3RyaW5nPiA9IFtcbiAgICAnQXJpem9uYScsXG4gICAgJ0ZyYW5raWUnLFxuICAgICdSb3N5JyxcbiAgICAnQ2lubmFtb24nLFxuICAgICdHaW5nZXInLFxuICAgICdUb2RkJyxcbiAgICAnUm9ja3knLFxuICAgICdGZWxpeCcsXG4gICAgJ1NhbmR5JyxcbiAgICAnQXJjaGllJyxcbiAgICAnRmx5bm4nLFxuICAgICdGb3h5JyxcbiAgICAnRWxtbycsXG4gICAgJ0VtYmVyJyxcbiAgICAnSHVudGVyJyxcbiAgICAnT3R0bycsXG4gICAgJ1NvbmljJyxcbiAgICAnQW1iZXInLFxuICAgICdNYXJvb24nLFxuICAgICdTcGFyaycsXG4gICAgJ1NwYXJreScsXG4gICAgJ1NseScsXG4gICAgJ1Njb3V0JyxcbiAgICAnUGVubnknLFxuICAgICdBc2gnLFxuICAgICdSb3NlJyxcbiAgICAnQXBvbGxvJyxcbiAgICAnQ2hpbGknLFxuICAgICdCbGF6ZScsXG4gICAgJ1JhZGlzaCcsXG4gICAgJ1NjYXJsZXR0JyxcbiAgICAnSnVsaWV0JyxcbiAgICAnR29sZGllJyxcbiAgICAnUm9vbmV5JyxcbiAgICAnUGFwcmlrYScsXG4gICAgJ0FscGluZScsXG4gICAgJ1J1c3R5JyxcbiAgICAnTWFwbGUnLFxuICAgICdWaXhlbicsXG4gICAgJ0RhdmlkJyxcbiAgICAnQXByaWNvdCcsXG4gICAgJ0NsYWlyZScsXG4gICAgJ1dpbG1hJyxcbiAgICAnQ29wcGVyJyxcbiAgICAnUGVwcGVyJyxcbiAgICAnQ3JpbXNvbicsXG4gICAgJ0FyaWVsJyxcbiAgICAnQXJ2aScsXG4gICAgJ0dlb3JnZScsXG4gICAgJ0V2YScsXG4gICAgJ0Z1enp5JyxcbiAgICAnUnVzc2VsbCcsXG4gICAgJ1J1ZnVzJyxcbiAgICAnTXlzdGljJyxcbiAgICAnTGVvcG9sZCcsXG4gICAgJ1NjdWxseScsXG4gICAgJ0ZlcnJpcycsXG4gICAgJ1JvYmluJyxcbiAgICAnWm9ycm8nLFxuICAgICdTY2FybGV0JyxcbiAgICAnQ29tZXQnLFxuICAgICdSb3dhbicsXG4gICAgJ0pha2UnLFxuICAgICdIb3BlJyxcbiAgICAnTW9sbHknLFxuICAgICdNYXJzJyxcbiAgICAnQXBwbGUnLFxuICAgICdHZW5ldmEnLFxuICAgICdSZWRmb3JkJyxcbiAgICAnQ2hlc3RudXQnLFxuICAgICdFdmVseW4nLFxuICAgICdSZWQnLFxuICAgICdBdXJvcmEnLFxuICAgICdBZ25peWEnLFxuICAgICdGaXR6JyxcbiAgICAnQ3Jpc3BpbicsXG4gICAgJ1N1bm55JyxcbiAgICAnQXV0dW1uJyxcbiAgICAnQnJpZGdldCcsXG4gICAgJ1J1YnknLFxuICAgICdJcmlzJyxcbiAgICAnUHVtcGtpbicsXG4gICAgJ1Jvc2UnLFxuICAgICdSb3NpZScsXG4gICAgJ1Zlc3RhJyxcbiAgICAnQWRvbGYnLFxuICAgICdMYXZhJyxcbiAgICAnQ29uYW4nLFxuICAgICdGbGFtZScsXG4gICAgJ09zd2FsZCcsXG4gICAgJ1RhaWxzJyxcbiAgICAnQ2hlc3RlcicsXG4gICAgJ0phc3BlcicsXG4gICAgJ0ZpbmNoJyxcbiAgICAnU2NhcmxldCcsXG4gICAgJ0NoZXd5JyxcbiAgICAnRmlubmljaycsXG4gICAgJ0Jpc2N1aXQnLFxuICAgICdQcmluY2UgSGFycnknLFxuICAgICdMb2tpJyxcbiAgICAnUGlwJyxcbiAgICAnUGlwcGluJyxcbl07XG4iLCJpbXBvcnQgeyBTdGF0ZXMgfSBmcm9tICcuLi9zdGF0ZXMnO1xuaW1wb3J0IHsgQmFzZVBldFR5cGUgfSBmcm9tICcuLi9iYXNlcGV0dHlwZSc7XG5pbXBvcnQgeyBQZXRDb2xvciB9IGZyb20gJy4uLy4uL2NvbW1vbi90eXBlcyc7XG5cbmV4cG9ydCBjbGFzcyBNb2QgZXh0ZW5kcyBCYXNlUGV0VHlwZSB7XG4gICAgbGFiZWwgPSAnbW9kJztcbiAgICBzdGF0aWMgcG9zc2libGVDb2xvcnMgPSBbUGV0Q29sb3IucHVycGxlXTtcbiAgICBzZXF1ZW5jZSA9IHtcbiAgICAgICAgc3RhcnRpbmdTdGF0ZTogU3RhdGVzLnNpdElkbGUsXG4gICAgICAgIHNlcXVlbmNlU3RhdGVzOiBbXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgc3RhdGU6IFN0YXRlcy5zaXRJZGxlLFxuICAgICAgICAgICAgICAgIHBvc3NpYmxlTmV4dFN0YXRlczogW1N0YXRlcy53YWxrUmlnaHQsIFN0YXRlcy5ydW5SaWdodF0sXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIHN0YXRlOiBTdGF0ZXMud2Fsa1JpZ2h0LFxuICAgICAgICAgICAgICAgIHBvc3NpYmxlTmV4dFN0YXRlczogW1N0YXRlcy53YWxrTGVmdCwgU3RhdGVzLnJ1bkxlZnRdLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBzdGF0ZTogU3RhdGVzLnJ1blJpZ2h0LFxuICAgICAgICAgICAgICAgIHBvc3NpYmxlTmV4dFN0YXRlczogW1N0YXRlcy53YWxrTGVmdCwgU3RhdGVzLnJ1bkxlZnRdLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBzdGF0ZTogU3RhdGVzLndhbGtMZWZ0LFxuICAgICAgICAgICAgICAgIHBvc3NpYmxlTmV4dFN0YXRlczogW1N0YXRlcy5zaXRJZGxlXSxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgc3RhdGU6IFN0YXRlcy5ydW5MZWZ0LFxuICAgICAgICAgICAgICAgIHBvc3NpYmxlTmV4dFN0YXRlczogW1N0YXRlcy5zaXRJZGxlXSxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgc3RhdGU6IFN0YXRlcy5jaGFzZSxcbiAgICAgICAgICAgICAgICBwb3NzaWJsZU5leHRTdGF0ZXM6IFtTdGF0ZXMuaWRsZVdpdGhCYWxsXSxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgc3RhdGU6IFN0YXRlcy5pZGxlV2l0aEJhbGwsXG4gICAgICAgICAgICAgICAgcG9zc2libGVOZXh0U3RhdGVzOiBbXG4gICAgICAgICAgICAgICAgICAgIFN0YXRlcy53YWxrUmlnaHQsXG4gICAgICAgICAgICAgICAgICAgIFN0YXRlcy53YWxrTGVmdCxcbiAgICAgICAgICAgICAgICAgICAgU3RhdGVzLnJ1bkxlZnQsXG4gICAgICAgICAgICAgICAgICAgIFN0YXRlcy5ydW5SaWdodCxcbiAgICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgXSxcbiAgICB9O1xuICAgIGdldCBlbW9qaSgpOiBzdHJpbmcge1xuICAgICAgICByZXR1cm4gJ/CfpJYnO1xuICAgIH1cbiAgICBnZXQgaGVsbG8oKTogc3RyaW5nIHtcbiAgICAgICAgcmV0dXJuIGAgSGksIEknbSBNb2QgdGhlIGRvdG5ldCBib3QsIHdoYXQgYXJlIHlvdSBidWlsZGluZyB0b2RheT9gO1xuICAgIH1cbn1cblxuZXhwb3J0IGNvbnN0IE1PRF9OQU1FUzogUmVhZG9ubHlBcnJheTxzdHJpbmc+ID0gW1xuICAgICdNb2QnLFxuICAgICdNb2RkeScsXG4gICAgJ0RvdG5ldGJvdCcsXG4gICAgJ0JvdCcsXG4gICAgJ1B1cnBsZSBQYWwnLFxuICAgICdSbyBCb3QnLFxuXTtcbiIsImltcG9ydCB7IFBldENvbG9yIH0gZnJvbSAnLi4vLi4vY29tbW9uL3R5cGVzJztcbmltcG9ydCB7IEJhc2VQZXRUeXBlIH0gZnJvbSAnLi4vYmFzZXBldHR5cGUnO1xuaW1wb3J0IHsgU3RhdGVzIH0gZnJvbSAnLi4vc3RhdGVzJztcblxuZXhwb3J0IGNsYXNzIFJhdCBleHRlbmRzIEJhc2VQZXRUeXBlIHtcbiAgICBsYWJlbCA9ICdyYXQnO1xuICAgIHN0YXRpYyBwb3NzaWJsZUNvbG9ycyA9IFtQZXRDb2xvci5ncmF5LCBQZXRDb2xvci53aGl0ZSwgUGV0Q29sb3IuYnJvd25dO1xuICAgIHNlcXVlbmNlID0ge1xuICAgICAgICBzdGFydGluZ1N0YXRlOiBTdGF0ZXMuc2l0SWRsZSxcbiAgICAgICAgc2VxdWVuY2VTdGF0ZXM6IFtcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBzdGF0ZTogU3RhdGVzLnNpdElkbGUsXG4gICAgICAgICAgICAgICAgcG9zc2libGVOZXh0U3RhdGVzOiBbU3RhdGVzLndhbGtSaWdodCwgU3RhdGVzLnJ1blJpZ2h0XSxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgc3RhdGU6IFN0YXRlcy53YWxrUmlnaHQsXG4gICAgICAgICAgICAgICAgcG9zc2libGVOZXh0U3RhdGVzOiBbU3RhdGVzLndhbGtMZWZ0LCBTdGF0ZXMucnVuTGVmdF0sXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIHN0YXRlOiBTdGF0ZXMucnVuUmlnaHQsXG4gICAgICAgICAgICAgICAgcG9zc2libGVOZXh0U3RhdGVzOiBbU3RhdGVzLndhbGtMZWZ0LCBTdGF0ZXMucnVuTGVmdF0sXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIHN0YXRlOiBTdGF0ZXMud2Fsa0xlZnQsXG4gICAgICAgICAgICAgICAgcG9zc2libGVOZXh0U3RhdGVzOiBbXG4gICAgICAgICAgICAgICAgICAgIFN0YXRlcy5zaXRJZGxlLFxuICAgICAgICAgICAgICAgICAgICBTdGF0ZXMud2Fsa1JpZ2h0LFxuICAgICAgICAgICAgICAgICAgICBTdGF0ZXMucnVuUmlnaHQsXG4gICAgICAgICAgICAgICAgXSxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgc3RhdGU6IFN0YXRlcy5ydW5MZWZ0LFxuICAgICAgICAgICAgICAgIHBvc3NpYmxlTmV4dFN0YXRlczogW1xuICAgICAgICAgICAgICAgICAgICBTdGF0ZXMuc2l0SWRsZSxcbiAgICAgICAgICAgICAgICAgICAgU3RhdGVzLndhbGtSaWdodCxcbiAgICAgICAgICAgICAgICAgICAgU3RhdGVzLnJ1blJpZ2h0LFxuICAgICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIHN0YXRlOiBTdGF0ZXMuY2hhc2UsXG4gICAgICAgICAgICAgICAgcG9zc2libGVOZXh0U3RhdGVzOiBbU3RhdGVzLmlkbGVXaXRoQmFsbF0sXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIHN0YXRlOiBTdGF0ZXMuaWRsZVdpdGhCYWxsLFxuICAgICAgICAgICAgICAgIHBvc3NpYmxlTmV4dFN0YXRlczogW1xuICAgICAgICAgICAgICAgICAgICBTdGF0ZXMud2Fsa1JpZ2h0LFxuICAgICAgICAgICAgICAgICAgICBTdGF0ZXMud2Fsa0xlZnQsXG4gICAgICAgICAgICAgICAgICAgIFN0YXRlcy5ydW5MZWZ0LFxuICAgICAgICAgICAgICAgICAgICBTdGF0ZXMucnVuUmlnaHQsXG4gICAgICAgICAgICAgICAgXSxcbiAgICAgICAgICAgIH0sXG4gICAgICAgIF0sXG4gICAgfTtcbiAgICBnZXQgZW1vamkoKTogc3RyaW5nIHtcbiAgICAgICAgcmV0dXJuICfwn5CAJztcbiAgICB9XG4gICAgZ2V0IGhlbGxvKCk6IHN0cmluZyB7XG4gICAgICAgIHJldHVybiBgUmF0IG5vaXNlcy4uLmA7XG4gICAgfVxufVxuXG5leHBvcnQgY29uc3QgUkFUX05BTUVTOiBSZWFkb25seUFycmF5PHN0cmluZz4gPSBbXG4gICAgJ01vbGx5JyxcbiAgICAnQ29jbycsXG4gICAgJ1J1YnknLFxuICAgICdMdWN5JyxcbiAgICAnTWlsbycsXG4gICAgJ0RhaXN5JyxcbiAgICAnQXJjaGllJyxcbiAgICAnT2xsaWUnLFxuICAgICdSb3NpZScsXG4gICAgJ0xvbGEnLFxuICAgICdGcmFua2llJyxcbiAgICAnUm94eScsXG4gICAgJ1BvcHB5JyxcbiAgICAnTHVuYScsXG4gICAgJ01pbGxpZScsXG4gICAgJ1JvY2t5JyxcbiAgICAnQWxmaWUnLFxuICAgICdIdWdvJyxcbiAgICAnUGVwcGVyJyxcbiAgICAnTGlseScsXG4gICAgJ1RpbGx5JyxcbiAgICAnTGVvJyxcbiAgICAnTWFnZ2llJyxcbiAgICAnTWlhJyxcbiAgICAnQ2hsb2UnLFxuICAgICdMdWx1JyxcbiAgICAnTWlzc3knLFxuICAgICdKYXNwZXInLFxuICAgICdCaWxseScsXG4gICAgJ05hbGEnLFxuICAgICdaaWdneScsXG4gICAgJ1pvZScsXG4gICAgJ1Blbm55JyxcbiAgICAnTWlsbHknLFxuICAgICdIb2xseScsXG4gICAgJ0hlbnJ5JyxcbiAgICAnTGlsbHknLFxuICAgICdQaXBwYScsXG4gICAgJ1NoYWRvdycsXG4gICAgJ0x1Y2t5JyxcbiAgICAnRHVrZScsXG4gICAgJ0plc3NpZScsXG4gICAgJ0Nvb2tpZScsXG4gICAgJ0JydWNlJyxcbiAgICAnSmF4JyxcbiAgICAnUmV4JyxcbiAgICAnTG91aWUnLFxuICAgICdKZXQnLFxuICAgICdCYW5qbycsXG4gICAgJ0JlYXUnLFxuICAgICdFbGxhJyxcbiAgICAnUmFscGgnLFxuICAgICdMb2tpJyxcbiAgICAnTGV4aScsXG4gICAgJ0NoaWxsaScsXG4gICAgJ0JpbGxpZScsXG4gICAgJ0xvdWlzJyxcbiAgICAnU2NvdXQnLFxuICAgICdDbGVvJyxcbiAgICAnU3BvdCcsXG4gICAgJ0JvbHQnLFxuICAgICdHaW5nZXInLFxuICAgICdEYWlzeScsXG4gICAgJ0FtZWxpYScsXG4gICAgJ09saXZlcicsXG4gICAgJ0dob3N0JyxcbiAgICAnTWlkbmlnaHQnLFxuICAgICdQdW1wa2luJyxcbiAgICAnU2hhZG93JyxcbiAgICAnQmlueCcsXG4gICAgJ1JpbGV5JyxcbiAgICAnTGVubnknLFxuICAgICdNYW5nbycsXG4gICAgJ0JvbycsXG4gICAgJ0JvdGFzJyxcbiAgICAnUm9tZW8nLFxuICAgICdTaW1vbicsXG4gICAgJ01pbW1vJyxcbiAgICAnQ2FybG90dGEnLFxuICAgICdGZWxpeCcsXG4gICAgJ0R1Y2hlc3MnLFxuICAgICdXYWx0ZXInLFxuICAgICdKZXNzZScsXG4gICAgJ0hhbmsnLFxuICAgICdHdXMnLFxuICAgICdNaWtlJyxcbiAgICAnU2F1bCcsXG4gICAgJ0hlY3RvcicsXG4gICAgJ1R1Y28nLFxuICAgICdKdXBpdGVyJyxcbiAgICAnVmVudXMnLFxuICAgICdBcG9sbG8nLFxuICAgICdBbGV4YW5kcml0ZScsXG4gICAgJ0FtYXpvbml0ZScsXG4gICAgJ0ZsaW50JyxcbiAgICAnSmV0dCcsXG4gICAgJ0t5YW5pdGUnLFxuICAgICdNaWNhJyxcbiAgICAnTWljYWgnLFxuXTtcbiIsImltcG9ydCB7IFBldENvbG9yIH0gZnJvbSAnLi4vLi4vY29tbW9uL3R5cGVzJztcbmltcG9ydCB7IEJhc2VQZXRUeXBlIH0gZnJvbSAnLi4vYmFzZXBldHR5cGUnO1xuaW1wb3J0IHsgU3RhdGVzIH0gZnJvbSAnLi4vc3RhdGVzJztcblxuZXhwb3J0IGNsYXNzIFJvY2t5IGV4dGVuZHMgQmFzZVBldFR5cGUge1xuICAgIGxhYmVsID0gJ3JvY2t5JztcbiAgICBzdGF0aWMgcG9zc2libGVDb2xvcnMgPSBbUGV0Q29sb3IuZ3JheV07XG4gICAgc2VxdWVuY2UgPSB7XG4gICAgICAgIHN0YXJ0aW5nU3RhdGU6IFN0YXRlcy5zaXRJZGxlLFxuICAgICAgICBzZXF1ZW5jZVN0YXRlczogW1xuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIHN0YXRlOiBTdGF0ZXMuc2l0SWRsZSxcbiAgICAgICAgICAgICAgICBwb3NzaWJsZU5leHRTdGF0ZXM6IFtTdGF0ZXMud2Fsa1JpZ2h0LCBTdGF0ZXMucnVuUmlnaHRdLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBzdGF0ZTogU3RhdGVzLndhbGtSaWdodCxcbiAgICAgICAgICAgICAgICBwb3NzaWJsZU5leHRTdGF0ZXM6IFtTdGF0ZXMuc2l0SWRsZSwgU3RhdGVzLnJ1blJpZ2h0XSxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgc3RhdGU6IFN0YXRlcy5ydW5SaWdodCxcbiAgICAgICAgICAgICAgICBwb3NzaWJsZU5leHRTdGF0ZXM6IFtTdGF0ZXMuc2l0SWRsZSwgU3RhdGVzLndhbGtSaWdodF0sXG4gICAgICAgICAgICB9LFxuICAgICAgICBdLFxuICAgIH07XG4gICAgZ2V0IGVtb2ppKCk6IHN0cmluZyB7XG4gICAgICAgIHJldHVybiAn8J+Sjic7XG4gICAgfVxuICAgIGdldCBjYW5DaGFzZSgpOiBib29sZWFuIHtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgICBnZXQgaGVsbG8oKTogc3RyaW5nIHtcbiAgICAgICAgcmV0dXJuIGAg8J+RiyBJJ20gcm9jayEgSSBhbHdheXMgUm9ja2A7XG4gICAgfVxufVxuXG5leHBvcnQgY29uc3QgUk9DS1lfTkFNRVM6IFJlYWRvbmx5QXJyYXk8c3RyaW5nPiA9IFtcbiAgICAnUm9ja3knLFxuICAgICdUaGUgUm9jaycsXG4gICAgJ1F1YXJ0enknLFxuICAgICdSb2NreSBJJyxcbiAgICAnUm9ja3kgSUknLFxuICAgICdSb2NreSBJSUknLFxuICAgICdQZWJibGVzIFNyLicsXG4gICAgJ0JpZyBHcmFuaXRlJyxcbiAgICAnQm91bGRlcicsXG4gICAgJ1JvY2tlZmVsbGVyJyxcbiAgICAnUGViYmxlJyxcbiAgICAnUm9ja3Nhbm5lJyxcbiAgICAnUm9ja3N0YXInLFxuICAgICdPbml4JyxcbiAgICAnUm9jayBhbmQgUm9sbCcsXG4gICAgJ0RvbG9taXRlJyxcbiAgICAnR3Jhbml0ZScsXG4gICAgJ01pc3MgTWFyYmxlJyxcbiAgICAnUm9jayBPbicsXG4gICAgJ0FtYmVyc3RvbmUnLFxuICAgICdSb2NrIFdpdGggTWUnLFxuICAgICdSb2NrIE9uIEl0JyxcbiAgICAnUm9jayBPdXQnLFxuXTtcbiIsImltcG9ydCB7IFBldENvbG9yIH0gZnJvbSAnLi4vLi4vY29tbW9uL3R5cGVzJztcbmltcG9ydCB7IEJhc2VQZXRUeXBlIH0gZnJvbSAnLi4vYmFzZXBldHR5cGUnO1xuaW1wb3J0IHsgU3RhdGVzIH0gZnJvbSAnLi4vc3RhdGVzJztcblxuZXhwb3J0IGNsYXNzIFJ1YmJlckR1Y2sgZXh0ZW5kcyBCYXNlUGV0VHlwZSB7XG4gICAgbGFiZWwgPSAncnViYmVyLWR1Y2snO1xuICAgIHN0YXRpYyBwb3NzaWJsZUNvbG9ycyA9IFtQZXRDb2xvci55ZWxsb3ddO1xuICAgIHNlcXVlbmNlID0ge1xuICAgICAgICBzdGFydGluZ1N0YXRlOiBTdGF0ZXMuc2l0SWRsZSxcbiAgICAgICAgc2VxdWVuY2VTdGF0ZXM6IFtcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBzdGF0ZTogU3RhdGVzLnNpdElkbGUsXG4gICAgICAgICAgICAgICAgcG9zc2libGVOZXh0U3RhdGVzOiBbU3RhdGVzLndhbGtSaWdodCwgU3RhdGVzLnJ1blJpZ2h0XSxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgc3RhdGU6IFN0YXRlcy53YWxrUmlnaHQsXG4gICAgICAgICAgICAgICAgcG9zc2libGVOZXh0U3RhdGVzOiBbU3RhdGVzLndhbGtMZWZ0LCBTdGF0ZXMucnVuTGVmdF0sXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIHN0YXRlOiBTdGF0ZXMucnVuUmlnaHQsXG4gICAgICAgICAgICAgICAgcG9zc2libGVOZXh0U3RhdGVzOiBbU3RhdGVzLndhbGtMZWZ0LCBTdGF0ZXMucnVuTGVmdF0sXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIHN0YXRlOiBTdGF0ZXMud2Fsa0xlZnQsXG4gICAgICAgICAgICAgICAgcG9zc2libGVOZXh0U3RhdGVzOiBbU3RhdGVzLnNpdElkbGVdLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBzdGF0ZTogU3RhdGVzLnJ1bkxlZnQsXG4gICAgICAgICAgICAgICAgcG9zc2libGVOZXh0U3RhdGVzOiBbU3RhdGVzLnNpdElkbGVdLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBzdGF0ZTogU3RhdGVzLmNoYXNlLFxuICAgICAgICAgICAgICAgIHBvc3NpYmxlTmV4dFN0YXRlczogW1N0YXRlcy5pZGxlV2l0aEJhbGxdLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBzdGF0ZTogU3RhdGVzLmlkbGVXaXRoQmFsbCxcbiAgICAgICAgICAgICAgICBwb3NzaWJsZU5leHRTdGF0ZXM6IFtcbiAgICAgICAgICAgICAgICAgICAgU3RhdGVzLndhbGtSaWdodCxcbiAgICAgICAgICAgICAgICAgICAgU3RhdGVzLndhbGtMZWZ0LFxuICAgICAgICAgICAgICAgICAgICBTdGF0ZXMucnVuTGVmdCxcbiAgICAgICAgICAgICAgICAgICAgU3RhdGVzLnJ1blJpZ2h0LFxuICAgICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICB9LFxuICAgICAgICBdLFxuICAgIH07XG4gICAgZ2V0IGVtb2ppKCk6IHN0cmluZyB7XG4gICAgICAgIHJldHVybiAn8J+QpSc7XG4gICAgfVxuICAgIGdldCBoZWxsbygpOiBzdHJpbmcge1xuICAgICAgICByZXR1cm4gYCBIaSwgSSBsb3ZlIHRvIHF1YWNrIGFyb3VuZCDwn5GLIWA7XG4gICAgfVxufVxuXG5leHBvcnQgY29uc3QgRFVDS19OQU1FUzogUmVhZG9ubHlBcnJheTxzdHJpbmc+ID0gW1xuICAgICdRdWFja3knLFxuICAgICdGbG9hdHknLFxuICAgICdEdWNrJyxcbiAgICAnTW9sbHknLFxuICAgICdTdW5zaGluZScsXG4gICAgJ0J1ZGR5JyxcbiAgICAnQ2hpcnB5JyxcbiAgICAnT3NjYXInLFxuICAgICdMdWN5JyxcbiAgICAnQmFpbGV5JyxcbiAgICAnQmVha3knLFxuICAgICdKZW1pbWEnLFxuICAgICdQZWFjaGVzJyxcbiAgICAnUXVhY2tlcnMnLFxuICAgICdKZWxseSBCZWFucycsXG4gICAgJ0RvbmFsZCcsXG4gICAgJ0NoYWR5JyxcbiAgICAnV2FkZGxlcycsXG4gICAgJ0JpbGwnLFxuICAgICdCdWJibGVzJyxcbiAgICAnSmFtZXMgUG9uZCcsXG4gICAgJ01vYnkgRHVjaycsXG4gICAgJ1F1YWNrIFNwYXJyb3cnLFxuICAgICdQZWFudXQnLFxuICAgICdQc3lkdWNrJyxcbiAgICAnTXIgUXVhY2snLFxuICAgICdMb3VpZScsXG4gICAgJ0dvbGR1Y2snLFxuICAgICdEYWlzeScsXG4gICAgJ1BpY2tsZXMnLFxuICAgICdEdWNreSBEdWNrJyxcbiAgICAnTXJzIEZsdWZmcycsXG4gICAgJ1NxdWVlaycsXG4gICAgJ0FjZScsXG4gICAgJ1J1YmJlcmR1Y2snLFxuICAgICdNcnMgQmVhaycsXG4gICAgJ0FwcmlsJyxcbiAgICAnVHV0dScsXG4gICAgJ0JpbGx5IHRoZSBkdWNrJyxcbiAgICAnRHVja3knLFxuICAgICdOZWNvJyxcbiAgICAnRG9kbycsXG4gICAgJ0NvbG9uZWwnLFxuICAgICdGcmFua2xpbicsXG4gICAgJ0VtbWV0dCcsXG4gICAgJ0J1YmJhJyxcbiAgICAnRGlsbGFyZCcsXG4gICAgJ0R1bmNhbicsXG4gICAgJ1BvZ28nLFxuICAgICdVbm8nLFxuICAgICdQZWFudXQnLFxuICAgICdOZXJvJyxcbiAgICAnTW93Z2xpJyxcbiAgICAnRWdnc3ByZXNzbycsXG4gICAgJ1dlYnN0ZXInLFxuICAgICdRdWFja2VyIEphY2snLFxuICAgICdQbHVja2VyJyxcbiAgICAnTWVla28nLFxuXTtcbiIsImltcG9ydCB7IFBldENvbG9yIH0gZnJvbSAnLi4vLi4vY29tbW9uL3R5cGVzJztcbmltcG9ydCB7IEJhc2VQZXRUeXBlIH0gZnJvbSAnLi4vYmFzZXBldHR5cGUnO1xuaW1wb3J0IHsgU3RhdGVzIH0gZnJvbSAnLi4vc3RhdGVzJztcblxuZXhwb3J0IGNsYXNzIFNuYWtlIGV4dGVuZHMgQmFzZVBldFR5cGUge1xuICAgIGxhYmVsID0gJ3NuYWtlJztcbiAgICBzdGF0aWMgcG9zc2libGVDb2xvcnMgPSBbUGV0Q29sb3IuZ3JlZW5dO1xuICAgIHNlcXVlbmNlID0ge1xuICAgICAgICBzdGFydGluZ1N0YXRlOiBTdGF0ZXMuc2l0SWRsZSxcbiAgICAgICAgc2VxdWVuY2VTdGF0ZXM6IFtcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBzdGF0ZTogU3RhdGVzLnNpdElkbGUsXG4gICAgICAgICAgICAgICAgcG9zc2libGVOZXh0U3RhdGVzOiBbU3RhdGVzLndhbGtSaWdodCwgU3RhdGVzLnJ1blJpZ2h0XSxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgc3RhdGU6IFN0YXRlcy53YWxrUmlnaHQsXG4gICAgICAgICAgICAgICAgcG9zc2libGVOZXh0U3RhdGVzOiBbU3RhdGVzLndhbGtMZWZ0LCBTdGF0ZXMucnVuTGVmdF0sXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIHN0YXRlOiBTdGF0ZXMucnVuUmlnaHQsXG4gICAgICAgICAgICAgICAgcG9zc2libGVOZXh0U3RhdGVzOiBbU3RhdGVzLndhbGtMZWZ0LCBTdGF0ZXMucnVuTGVmdF0sXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIHN0YXRlOiBTdGF0ZXMud2Fsa0xlZnQsXG4gICAgICAgICAgICAgICAgcG9zc2libGVOZXh0U3RhdGVzOiBbXG4gICAgICAgICAgICAgICAgICAgIFN0YXRlcy5zaXRJZGxlLFxuICAgICAgICAgICAgICAgICAgICBTdGF0ZXMud2Fsa1JpZ2h0LFxuICAgICAgICAgICAgICAgICAgICBTdGF0ZXMucnVuUmlnaHQsXG4gICAgICAgICAgICAgICAgXSxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgc3RhdGU6IFN0YXRlcy5ydW5MZWZ0LFxuICAgICAgICAgICAgICAgIHBvc3NpYmxlTmV4dFN0YXRlczogW1xuICAgICAgICAgICAgICAgICAgICBTdGF0ZXMuc2l0SWRsZSxcbiAgICAgICAgICAgICAgICAgICAgU3RhdGVzLndhbGtSaWdodCxcbiAgICAgICAgICAgICAgICAgICAgU3RhdGVzLnJ1blJpZ2h0LFxuICAgICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIHN0YXRlOiBTdGF0ZXMuY2hhc2UsXG4gICAgICAgICAgICAgICAgcG9zc2libGVOZXh0U3RhdGVzOiBbU3RhdGVzLmlkbGVXaXRoQmFsbF0sXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIHN0YXRlOiBTdGF0ZXMuaWRsZVdpdGhCYWxsLFxuICAgICAgICAgICAgICAgIHBvc3NpYmxlTmV4dFN0YXRlczogW1xuICAgICAgICAgICAgICAgICAgICBTdGF0ZXMud2Fsa1JpZ2h0LFxuICAgICAgICAgICAgICAgICAgICBTdGF0ZXMud2Fsa0xlZnQsXG4gICAgICAgICAgICAgICAgICAgIFN0YXRlcy5ydW5MZWZ0LFxuICAgICAgICAgICAgICAgICAgICBTdGF0ZXMucnVuUmlnaHQsXG4gICAgICAgICAgICAgICAgXSxcbiAgICAgICAgICAgIH0sXG4gICAgICAgIF0sXG4gICAgfTtcbiAgICBnZXQgZW1vamkoKTogc3RyaW5nIHtcbiAgICAgICAgcmV0dXJuICfwn5CNJztcbiAgICB9XG4gICAgZ2V0IGhlbGxvKCk6IHN0cmluZyB7XG4gICAgICAgIHJldHVybiBgU3NzLi4uIE9oLiBPaCBteSBnb3NoISBJJ20gYSBzbmFrZSFgO1xuICAgIH1cbn1cblxuZXhwb3J0IGNvbnN0IFNOQUtFX05BTUVTOiBSZWFkb25seUFycmF5PHN0cmluZz4gPSBbXG4gICAgJ1NuZWFreScsXG4gICAgJ01yIFNsaXBwZXJ5JyxcbiAgICAnSGlzc3kgRWxsaW90dCcsXG4gICAgJ01vbGx5JyxcbiAgICAnQ29jbycsXG4gICAgJ0J1ZGR5JyxcbiAgICAnUnVieScsXG4gICAgJ0JhaWxleScsXG4gICAgJ01heCcsXG4gICAgJ1NlYicsXG4gICAgJ0thYScsXG4gICAgJ01yIEhpc3MnLFxuICAgICdNaXNzIEhpc3MnLFxuICAgICdTbmFrdScsXG4gICAgJ0thYScsXG4gICAgJ01hZGFtZSBTbmFrZScsXG4gICAgJ1NpciBIaXNzJyxcbiAgICAnTG9raScsXG4gICAgJ1N0ZWVsaXgnLFxuICAgICdHeWFyYWRvcycsXG4gICAgJ1NldmlwZXInLFxuICAgICdFa2FuZXMnLFxuICAgICdBcmJvaycsXG4gICAgJ1NuaXZ5JyxcbiAgICAnU2VydmluZScsXG4gICAgJ1NlcnBlcmlvcicsXG4gICAgJ01vam8nLFxuICAgICdNb3NzJyxcbiAgICAnTmlnZWwnLFxuICAgICdUb290c2llJyxcbiAgICAnU2FtbXknLFxuICAgICdaaWdneScsXG4gICAgJ0FzbW9kZXVzJyxcbiAgICAnQXR0aWxhJyxcbiAgICAnQmFzaWwnLFxuICAgICdEaWFibG8nLFxuICAgICdFZGVuJyxcbiAgICAnRXZlJyxcbiAgICAnSGVhdmVuJyxcbiAgICAnSHlkcmEnLFxuICAgICdJbmRpYW5hJyxcbiAgICAnSmFmYWFyJyxcbiAgICAnS2FhJyxcbiAgICAnTWVkdXNhJyxcbiAgICAnTmFnYScsXG4gICAgJ1NldmVydXMnLFxuICAgICdTbHl0aGVyaW4nLFxuICAgICdTbmFwZScsXG4gICAgJ1JhdmVuJyxcbiAgICAnU2xpZGVyJyxcbiAgICAnU2xpbmt5JyxcbiAgICAnU3RyaXBlcycsXG5dO1xuIiwiaW1wb3J0IHsgUGV0Q29sb3IgfSBmcm9tICcuLi8uLi9jb21tb24vdHlwZXMnO1xuaW1wb3J0IHsgQmFzZVBldFR5cGUgfSBmcm9tICcuLi9iYXNlcGV0dHlwZSc7XG5pbXBvcnQgeyBTdGF0ZXMgfSBmcm9tICcuLi9zdGF0ZXMnO1xuXG5leHBvcnQgY2xhc3MgVG90b3JvIGV4dGVuZHMgQmFzZVBldFR5cGUge1xuICAgIGxhYmVsID0gJ3RvdG9ybyc7XG4gICAgc3RhdGljIHBvc3NpYmxlQ29sb3JzID0gW1BldENvbG9yLmdyYXldO1xuICAgIHNlcXVlbmNlID0ge1xuICAgICAgICBzdGFydGluZ1N0YXRlOiBTdGF0ZXMuc2l0SWRsZSxcbiAgICAgICAgc2VxdWVuY2VTdGF0ZXM6IFtcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBzdGF0ZTogU3RhdGVzLnNpdElkbGUsXG4gICAgICAgICAgICAgICAgcG9zc2libGVOZXh0U3RhdGVzOiBbU3RhdGVzLndhbGtSaWdodCwgU3RhdGVzLmxpZV0sXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIHN0YXRlOiBTdGF0ZXMubGllLFxuICAgICAgICAgICAgICAgIHBvc3NpYmxlTmV4dFN0YXRlczogW1N0YXRlcy53YWxrUmlnaHQsIFN0YXRlcy53YWxrTGVmdF0sXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIHN0YXRlOiBTdGF0ZXMud2Fsa1JpZ2h0LFxuICAgICAgICAgICAgICAgIHBvc3NpYmxlTmV4dFN0YXRlczogW1N0YXRlcy53YWxrTGVmdCwgU3RhdGVzLnNpdElkbGVdLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBzdGF0ZTogU3RhdGVzLndhbGtMZWZ0LFxuICAgICAgICAgICAgICAgIHBvc3NpYmxlTmV4dFN0YXRlczogW1xuICAgICAgICAgICAgICAgICAgICBTdGF0ZXMuc2l0SWRsZSxcbiAgICAgICAgICAgICAgICAgICAgU3RhdGVzLmNsaW1iV2FsbExlZnQsXG4gICAgICAgICAgICAgICAgICAgIFN0YXRlcy5zaXRJZGxlLFxuICAgICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIHN0YXRlOiBTdGF0ZXMuY2xpbWJXYWxsTGVmdCxcbiAgICAgICAgICAgICAgICBwb3NzaWJsZU5leHRTdGF0ZXM6IFtTdGF0ZXMud2FsbEhhbmdMZWZ0XSxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgc3RhdGU6IFN0YXRlcy53YWxsSGFuZ0xlZnQsXG4gICAgICAgICAgICAgICAgcG9zc2libGVOZXh0U3RhdGVzOiBbU3RhdGVzLmp1bXBEb3duTGVmdF0sXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIHN0YXRlOiBTdGF0ZXMuanVtcERvd25MZWZ0LFxuICAgICAgICAgICAgICAgIHBvc3NpYmxlTmV4dFN0YXRlczogW1N0YXRlcy5sYW5kXSxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgc3RhdGU6IFN0YXRlcy5sYW5kLFxuICAgICAgICAgICAgICAgIHBvc3NpYmxlTmV4dFN0YXRlczogW1xuICAgICAgICAgICAgICAgICAgICBTdGF0ZXMuc2l0SWRsZSxcbiAgICAgICAgICAgICAgICAgICAgU3RhdGVzLndhbGtSaWdodCxcbiAgICAgICAgICAgICAgICAgICAgU3RhdGVzLmxpZSxcbiAgICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBzdGF0ZTogU3RhdGVzLmNoYXNlLFxuICAgICAgICAgICAgICAgIHBvc3NpYmxlTmV4dFN0YXRlczogW1N0YXRlcy5pZGxlV2l0aEJhbGxdLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBzdGF0ZTogU3RhdGVzLmlkbGVXaXRoQmFsbCxcbiAgICAgICAgICAgICAgICBwb3NzaWJsZU5leHRTdGF0ZXM6IFtTdGF0ZXMud2Fsa1JpZ2h0LCBTdGF0ZXMud2Fsa0xlZnRdLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgXSxcbiAgICB9O1xuICAgIGdldCBlbW9qaSgpOiBzdHJpbmcge1xuICAgICAgICByZXR1cm4gJ/CfkL4nO1xuICAgIH1cbiAgICBnZXQgaGVsbG8oKTogc3RyaW5nIHtcbiAgICAgICAgcmV0dXJuIGBUcnkgTGF1Z2hpbmcuIFRoZW4gV2hhdGV2ZXIgU2NhcmVzIFlvdSBXaWxsIEdvIEF3YXkuIPCfjq1gO1xuICAgIH1cbn1cblxuZXhwb3J0IGNvbnN0IFRPVE9ST19OQU1FUzogUmVhZG9ubHlBcnJheTxzdHJpbmc+ID0gW1xuICAgICdUb3Rvcm8nLFxuICAgICfjg4jjg4jjg60nLFxuICAgICdNYXgnLFxuICAgICdNb2xseScsXG4gICAgJ0NvY28nLFxuICAgICdCdWRkeScsXG4gICAgJ1J1YnknLFxuICAgICdPc2NhcicsXG4gICAgJ0x1Y3knLFxuICAgICdCYWlsZXknLFxuICAgICdCaWcgZmVsbGEnLFxuXTtcbiIsImltcG9ydCB7IFBldENvbG9yIH0gZnJvbSAnLi4vLi4vY29tbW9uL3R5cGVzJztcbmltcG9ydCB7IEJhc2VQZXRUeXBlIH0gZnJvbSAnLi4vYmFzZXBldHR5cGUnO1xuaW1wb3J0IHsgU3RhdGVzIH0gZnJvbSAnLi4vc3RhdGVzJztcblxuZXhwb3J0IGNsYXNzIFR1cnRsZSBleHRlbmRzIEJhc2VQZXRUeXBlIHtcbiAgICBsYWJlbCA9ICd0dXJ0bGUnO1xuICAgIHN0YXRpYyBwb3NzaWJsZUNvbG9ycyA9IFtQZXRDb2xvci5ncmVlbiwgUGV0Q29sb3Iub3JhbmdlXTtcbiAgICBzZXF1ZW5jZSA9IHtcbiAgICAgICAgc3RhcnRpbmdTdGF0ZTogU3RhdGVzLnNpdElkbGUsXG4gICAgICAgIHNlcXVlbmNlU3RhdGVzOiBbXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgc3RhdGU6IFN0YXRlcy5zaXRJZGxlLFxuICAgICAgICAgICAgICAgIHBvc3NpYmxlTmV4dFN0YXRlczogW1xuICAgICAgICAgICAgICAgICAgICBTdGF0ZXMud2Fsa1JpZ2h0LFxuICAgICAgICAgICAgICAgICAgICBTdGF0ZXMucnVuUmlnaHQsXG4gICAgICAgICAgICAgICAgICAgIFN0YXRlcy5saWUsXG4gICAgICAgICAgICAgICAgXSxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgc3RhdGU6IFN0YXRlcy5saWUsXG4gICAgICAgICAgICAgICAgcG9zc2libGVOZXh0U3RhdGVzOiBbU3RhdGVzLndhbGtSaWdodCwgU3RhdGVzLnJ1blJpZ2h0XSxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgc3RhdGU6IFN0YXRlcy53YWxrUmlnaHQsXG4gICAgICAgICAgICAgICAgcG9zc2libGVOZXh0U3RhdGVzOiBbU3RhdGVzLndhbGtMZWZ0LCBTdGF0ZXMucnVuTGVmdF0sXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIHN0YXRlOiBTdGF0ZXMucnVuUmlnaHQsXG4gICAgICAgICAgICAgICAgcG9zc2libGVOZXh0U3RhdGVzOiBbU3RhdGVzLndhbGtMZWZ0LCBTdGF0ZXMucnVuTGVmdF0sXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIHN0YXRlOiBTdGF0ZXMud2Fsa0xlZnQsXG4gICAgICAgICAgICAgICAgcG9zc2libGVOZXh0U3RhdGVzOiBbXG4gICAgICAgICAgICAgICAgICAgIFN0YXRlcy5zaXRJZGxlLFxuICAgICAgICAgICAgICAgICAgICBTdGF0ZXMubGllLFxuICAgICAgICAgICAgICAgICAgICBTdGF0ZXMud2Fsa1JpZ2h0LFxuICAgICAgICAgICAgICAgICAgICBTdGF0ZXMucnVuUmlnaHQsXG4gICAgICAgICAgICAgICAgXSxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgc3RhdGU6IFN0YXRlcy5ydW5MZWZ0LFxuICAgICAgICAgICAgICAgIHBvc3NpYmxlTmV4dFN0YXRlczogW1xuICAgICAgICAgICAgICAgICAgICBTdGF0ZXMuc2l0SWRsZSxcbiAgICAgICAgICAgICAgICAgICAgU3RhdGVzLmxpZSxcbiAgICAgICAgICAgICAgICAgICAgU3RhdGVzLndhbGtSaWdodCxcbiAgICAgICAgICAgICAgICAgICAgU3RhdGVzLnJ1blJpZ2h0LFxuICAgICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIHN0YXRlOiBTdGF0ZXMuY2hhc2UsXG4gICAgICAgICAgICAgICAgcG9zc2libGVOZXh0U3RhdGVzOiBbU3RhdGVzLmlkbGVXaXRoQmFsbF0sXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIHN0YXRlOiBTdGF0ZXMuaWRsZVdpdGhCYWxsLFxuICAgICAgICAgICAgICAgIHBvc3NpYmxlTmV4dFN0YXRlczogW1xuICAgICAgICAgICAgICAgICAgICBTdGF0ZXMud2Fsa1JpZ2h0LFxuICAgICAgICAgICAgICAgICAgICBTdGF0ZXMud2Fsa0xlZnQsXG4gICAgICAgICAgICAgICAgICAgIFN0YXRlcy5ydW5MZWZ0LFxuICAgICAgICAgICAgICAgICAgICBTdGF0ZXMucnVuUmlnaHQsXG4gICAgICAgICAgICAgICAgXSxcbiAgICAgICAgICAgIH0sXG4gICAgICAgIF0sXG4gICAgfTtcbiAgICBnZXQgZW1vamkoKTogc3RyaW5nIHtcbiAgICAgICAgcmV0dXJuICfwn5CiJztcbiAgICB9XG4gICAgZ2V0IGhlbGxvKCk6IHN0cmluZyB7XG4gICAgICAgIHJldHVybiBgIFNsb3cgYW5kIHN0ZWFkeSB3aW5zIHRoZSByYWNlIWA7XG4gICAgfVxufVxuXG5leHBvcnQgY29uc3QgVFVSVExFX05BTUVTOiBSZWFkb25seUFycmF5PHN0cmluZz4gPSBbXG4gICAgJ1NoZWxsZG9uJyxcbiAgICAnU2hlbGx5JyxcbiAgICAnU2hlbGxleScsXG4gICAgJ1NoZWxkb24nLFxuICAgICdUb3J0dWdhJyxcbiAgICAnVG9ydGVsbGluaScsXG4gICAgJ0NoYXJsaWUnLFxuICAgICdSb3NzJyxcbiAgICAnU3F1aXJ0JyxcbiAgICAnQ3J1c2gnLFxuICAgICdTcXVpcnRsZScsXG4gICAgJ0tvb3BhJyxcbiAgICAnQm93c2VyJyxcbiAgICAnQm93c2V0dGUnLFxuICAgICdGcmFua2xpbicsXG4gICAgJ0tvb3BhIFRyb29wYScsXG4gICAgJ0JsYXN0b2lzZScsXG4gICAgJ0NlY2lsJyxcbiAgICAnV2FydG9ydGxlJyxcbiAgICAnRG9uYXRlbGxvJyxcbiAgICAnTWljaGFlbGFuZ2VsbycsXG4gICAgJ0xlb25hcmRvJyxcbiAgICAnTGVvJyxcbiAgICAnRG9ubnknLFxuICAgICdNaWtleScsXG4gICAgJ1JhcGhhZWwnLFxuICAgICdDaGVsb25lJyxcbiAgICAnRW1pbHknLFxuICAgICdKb3NlcGgnLFxuICAgICdBbm5lJyxcbiAgICAnWmFncmV1cycsXG4gICAgJ0tyYXRvcycsXG4gICAgJ0F0cmV1cycsXG4gICAgJ0xva2knLFxuICAgICdGcmV5YScsXG4gICAgJ0JyZXZpdHknLFxuICAgICdBcnRodXInLFxuICAgICdEb3lsZScsXG4gICAgJ1NoZXJsb2NrJyxcbiAgICAnQ2hhcmxpJyxcbl07XG4iLCJpbXBvcnQgeyBQZXRDb2xvciB9IGZyb20gJy4uLy4uL2NvbW1vbi90eXBlcyc7XG5pbXBvcnQgeyBCYXNlUGV0VHlwZSB9IGZyb20gJy4uL2Jhc2VwZXR0eXBlJztcbmltcG9ydCB7IFN0YXRlcyB9IGZyb20gJy4uL3N0YXRlcyc7XG5cbmV4cG9ydCBjbGFzcyBaYXBweSBleHRlbmRzIEJhc2VQZXRUeXBlIHtcbiAgICBsYWJlbCA9ICd6YXBweSc7XG4gICAgc3RhdGljIHBvc3NpYmxlQ29sb3JzID0gW1BldENvbG9yLnllbGxvd107XG4gICAgc2VxdWVuY2UgPSB7XG4gICAgICAgIHN0YXJ0aW5nU3RhdGU6IFN0YXRlcy5zaXRJZGxlLFxuICAgICAgICBzZXF1ZW5jZVN0YXRlczogW1xuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIHN0YXRlOiBTdGF0ZXMuc2l0SWRsZSxcbiAgICAgICAgICAgICAgICBwb3NzaWJsZU5leHRTdGF0ZXM6IFtTdGF0ZXMud2Fsa1JpZ2h0LCBTdGF0ZXMucnVuUmlnaHRdLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBzdGF0ZTogU3RhdGVzLndhbGtSaWdodCxcbiAgICAgICAgICAgICAgICBwb3NzaWJsZU5leHRTdGF0ZXM6IFtTdGF0ZXMud2Fsa0xlZnQsIFN0YXRlcy5ydW5MZWZ0XSxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgc3RhdGU6IFN0YXRlcy5ydW5SaWdodCxcbiAgICAgICAgICAgICAgICBwb3NzaWJsZU5leHRTdGF0ZXM6IFtTdGF0ZXMud2Fsa0xlZnQsIFN0YXRlcy5ydW5MZWZ0XSxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgc3RhdGU6IFN0YXRlcy53YWxrTGVmdCxcbiAgICAgICAgICAgICAgICBwb3NzaWJsZU5leHRTdGF0ZXM6IFtTdGF0ZXMuc2l0SWRsZV0sXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIHN0YXRlOiBTdGF0ZXMucnVuTGVmdCxcbiAgICAgICAgICAgICAgICBwb3NzaWJsZU5leHRTdGF0ZXM6IFtTdGF0ZXMuc2l0SWRsZV0sXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIHN0YXRlOiBTdGF0ZXMuY2hhc2UsXG4gICAgICAgICAgICAgICAgcG9zc2libGVOZXh0U3RhdGVzOiBbU3RhdGVzLmlkbGVXaXRoQmFsbF0sXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIHN0YXRlOiBTdGF0ZXMuaWRsZVdpdGhCYWxsLFxuICAgICAgICAgICAgICAgIHBvc3NpYmxlTmV4dFN0YXRlczogW1xuICAgICAgICAgICAgICAgICAgICBTdGF0ZXMud2Fsa1JpZ2h0LFxuICAgICAgICAgICAgICAgICAgICBTdGF0ZXMud2Fsa0xlZnQsXG4gICAgICAgICAgICAgICAgICAgIFN0YXRlcy5ydW5MZWZ0LFxuICAgICAgICAgICAgICAgICAgICBTdGF0ZXMucnVuUmlnaHQsXG4gICAgICAgICAgICAgICAgXSxcbiAgICAgICAgICAgIH0sXG4gICAgICAgIF0sXG4gICAgfTtcbiAgICBnZXQgZW1vamkoKTogc3RyaW5nIHtcbiAgICAgICAgcmV0dXJuICfimqEnO1xuICAgIH1cbiAgICBnZXQgaGVsbG8oKTogc3RyaW5nIHtcbiAgICAgICAgLy8gVE9ETzogIzE5MyBBZGQgYSBjdXN0b20gbWVzc2FnZSBmb3IgemFwcHlcbiAgICAgICAgcmV0dXJuIGAgSGVsbG8gdGhpcyBpcyBaYXBweSEgRG8gSSBsb29rIGZhbWlsaWFyPz8gSSBhbSB0aGUgbWFzY290IGZvciBBenVyZSBGdW5jdGlvbnPwn5iJYDtcbiAgICB9XG59XG5cbmV4cG9ydCBjb25zdCBaQVBQWV9OQU1FUzogUmVhZG9ubHlBcnJheTxzdHJpbmc+ID0gW1xuICAgICdaYXBweScsXG4gICAgJ1ppcHB5JyxcbiAgICAnWmFwcHkgSnIuJyxcbiAgICAnWm9wcHknLFxuICAgICdadXBweScsXG4gICAgJ1plcHB5JyxcbiAgICAnQmlnIFonLFxuICAgICdMaXR0bGUgeicsXG4gICAgJ1RoZSBGbGFzaCcsXG4gICAgJ1Rob3InLFxuICAgICdFbGVjdHJpYyBCb2x0JyxcbiAgICAnQXp1bGEnLFxuICAgICdMaWdodG5pbmcgQm9sdCcsXG4gICAgJ1Bvd2VyJyxcbiAgICAnU29uaWMnLFxuICAgICdTcGVlZHknLFxuICAgICdSdXNoJyxcbl07XG4iLCJpbXBvcnQgeyBQZXRDb2xvciwgUGV0VHlwZSB9IGZyb20gJy4uL2NvbW1vbi90eXBlcyc7XG5cbmV4cG9ydCBpbnRlcmZhY2UgSVBldFR5cGUge1xuICAgIG5leHRGcmFtZSgpOiB2b2lkO1xuXG4gICAgLy8gU3BlY2lhbCBtZXRob2RzIGZvciBhY3Rpb25zXG4gICAgY2FuU3dpcGU6IGJvb2xlYW47XG4gICAgY2FuQ2hhc2U6IGJvb2xlYW47XG4gICAgc3dpcGUoKTogdm9pZDtcbiAgICBjaGFzZShiYWxsU3RhdGU6IEJhbGxTdGF0ZSwgY2FudmFzOiBIVE1MQ2FudmFzRWxlbWVudCk6IHZvaWQ7XG4gICAgc3BlZWQ6IG51bWJlcjtcbiAgICBpc01vdmluZzogYm9vbGVhbjtcbiAgICBoZWxsbzogc3RyaW5nO1xuXG4gICAgLy8gU3RhdGUgQVBJXG4gICAgZ2V0U3RhdGUoKTogUGV0SW5zdGFuY2VTdGF0ZTtcbiAgICByZWNvdmVyU3RhdGUoc3RhdGU6IFBldEluc3RhbmNlU3RhdGUpOiB2b2lkO1xuICAgIHJlY292ZXJGcmllbmQoZnJpZW5kOiBJUGV0VHlwZSk6IHZvaWQ7XG5cbiAgICAvLyBQb3NpdGlvbmluZ1xuICAgIGJvdHRvbTogbnVtYmVyO1xuICAgIGxlZnQ6IG51bWJlcjtcbiAgICBwb3NpdGlvbkJvdHRvbShib3R0b206IG51bWJlcik6IHZvaWQ7XG4gICAgcG9zaXRpb25MZWZ0KGxlZnQ6IG51bWJlcik6IHZvaWQ7XG4gICAgd2lkdGg6IG51bWJlcjtcbiAgICBmbG9vcjogbnVtYmVyO1xuXG4gICAgLy8gRnJpZW5kcyBBUElcbiAgICBuYW1lOiBzdHJpbmc7XG4gICAgZW1vamk6IHN0cmluZztcbiAgICBoYXNGcmllbmQ6IGJvb2xlYW47XG4gICAgZnJpZW5kOiBJUGV0VHlwZSB8IHVuZGVmaW5lZDtcbiAgICBtYWtlRnJpZW5kc1dpdGgoZnJpZW5kOiBJUGV0VHlwZSk6IGJvb2xlYW47XG4gICAgaXNQbGF5aW5nOiBib29sZWFuO1xuXG4gICAgc2hvd1NwZWVjaEJ1YmJsZShtZXNzYWdlOiBzdHJpbmcsIGR1cmF0aW9uOiBudW1iZXIpOiB2b2lkO1xufVxuXG5leHBvcnQgY2xhc3MgUGV0SW5zdGFuY2VTdGF0ZSB7XG4gICAgY3VycmVudFN0YXRlRW51bTogU3RhdGVzIHwgdW5kZWZpbmVkO1xufVxuXG5leHBvcnQgY2xhc3MgUGV0RWxlbWVudFN0YXRlIHtcbiAgICBwZXRTdGF0ZTogUGV0SW5zdGFuY2VTdGF0ZSB8IHVuZGVmaW5lZDtcbiAgICBwZXRUeXBlOiBQZXRUeXBlIHwgdW5kZWZpbmVkO1xuICAgIHBldENvbG9yOiBQZXRDb2xvciB8IHVuZGVmaW5lZDtcbiAgICBlbExlZnQ6IHN0cmluZyB8IHVuZGVmaW5lZDtcbiAgICBlbEJvdHRvbTogc3RyaW5nIHwgdW5kZWZpbmVkO1xuICAgIHBldE5hbWU6IHN0cmluZyB8IHVuZGVmaW5lZDtcbiAgICBwZXRGcmllbmQ6IHN0cmluZyB8IHVuZGVmaW5lZDtcbn1cblxuZXhwb3J0IGNsYXNzIFBldFBhbmVsU3RhdGUge1xuICAgIHBldFN0YXRlczogQXJyYXk8UGV0RWxlbWVudFN0YXRlPiB8IHVuZGVmaW5lZDtcbiAgICBwZXRDb3VudGVyOiBudW1iZXIgfCB1bmRlZmluZWQ7XG59XG5cbmV4cG9ydCBlbnVtIEhvcml6b250YWxEaXJlY3Rpb24ge1xuICAgIGxlZnQsXG4gICAgcmlnaHQsXG4gICAgbmF0dXJhbCwgLy8gTm8gY2hhbmdlIHRvIGN1cnJlbnQgZGlyZWN0aW9uXG59XG5cbmV4cG9ydCBjb25zdCBlbnVtIFN0YXRlcyB7XG4gICAgc2l0SWRsZSA9ICdzaXQtaWRsZScsXG4gICAgd2Fsa1JpZ2h0ID0gJ3dhbGstcmlnaHQnLFxuICAgIHdhbGtMZWZ0ID0gJ3dhbGstbGVmdCcsXG4gICAgcnVuUmlnaHQgPSAncnVuLXJpZ2h0JyxcbiAgICBydW5MZWZ0ID0gJ3J1bi1sZWZ0JyxcbiAgICBsaWUgPSAnbGllJyxcbiAgICB3YWxsSGFuZ0xlZnQgPSAnd2FsbC1oYW5nLWxlZnQnLFxuICAgIGNsaW1iV2FsbExlZnQgPSAnY2xpbWItd2FsbC1sZWZ0JyxcbiAgICBqdW1wRG93bkxlZnQgPSAnanVtcC1kb3duLWxlZnQnLFxuICAgIGxhbmQgPSAnbGFuZCcsXG4gICAgc3dpcGUgPSAnc3dpcGUnLFxuICAgIGlkbGVXaXRoQmFsbCA9ICdpZGxlLXdpdGgtYmFsbCcsXG4gICAgY2hhc2UgPSAnY2hhc2UnLFxuICAgIGNoYXNlRnJpZW5kID0gJ2NoYXNlLWZyaWVuZCcsXG59XG5cbmV4cG9ydCBlbnVtIEZyYW1lUmVzdWx0IHtcbiAgICBzdGF0ZUNvbnRpbnVlLFxuICAgIHN0YXRlQ29tcGxldGUsXG4gICAgLy8gU3BlY2lhbCBzdGF0ZXNcbiAgICBzdGF0ZUNhbmNlbCxcbn1cblxuZXhwb3J0IGNsYXNzIEJhbGxTdGF0ZSB7XG4gICAgY3g6IG51bWJlcjtcbiAgICBjeTogbnVtYmVyO1xuICAgIHZ4OiBudW1iZXI7XG4gICAgdnk6IG51bWJlcjtcbiAgICBwYXVzZWQ6IGJvb2xlYW47XG5cbiAgICBjb25zdHJ1Y3RvcihjeDogbnVtYmVyLCBjeTogbnVtYmVyLCB2eDogbnVtYmVyLCB2eTogbnVtYmVyKSB7XG4gICAgICAgIHRoaXMuY3ggPSBjeDtcbiAgICAgICAgdGhpcy5jeSA9IGN5O1xuICAgICAgICB0aGlzLnZ4ID0gdng7XG4gICAgICAgIHRoaXMudnkgPSB2eTtcbiAgICAgICAgdGhpcy5wYXVzZWQgPSBmYWxzZTtcbiAgICB9XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBpc1N0YXRlQWJvdmVHcm91bmQoc3RhdGU6IFN0YXRlcyk6IGJvb2xlYW4ge1xuICAgIHJldHVybiAoXG4gICAgICAgIHN0YXRlID09PSBTdGF0ZXMuY2xpbWJXYWxsTGVmdCB8fFxuICAgICAgICBzdGF0ZSA9PT0gU3RhdGVzLmp1bXBEb3duTGVmdCB8fFxuICAgICAgICBzdGF0ZSA9PT0gU3RhdGVzLmxhbmQgfHxcbiAgICAgICAgc3RhdGUgPT09IFN0YXRlcy53YWxsSGFuZ0xlZnRcbiAgICApO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gcmVzb2x2ZVN0YXRlKHN0YXRlOiBzdHJpbmcsIHBldDogSVBldFR5cGUpOiBJU3RhdGUge1xuICAgIHN3aXRjaCAoc3RhdGUpIHtcbiAgICAgICAgY2FzZSBTdGF0ZXMuc2l0SWRsZTpcbiAgICAgICAgICAgIHJldHVybiBuZXcgU2l0SWRsZVN0YXRlKHBldCk7XG4gICAgICAgIGNhc2UgU3RhdGVzLndhbGtSaWdodDpcbiAgICAgICAgICAgIHJldHVybiBuZXcgV2Fsa1JpZ2h0U3RhdGUocGV0KTtcbiAgICAgICAgY2FzZSBTdGF0ZXMud2Fsa0xlZnQ6XG4gICAgICAgICAgICByZXR1cm4gbmV3IFdhbGtMZWZ0U3RhdGUocGV0KTtcbiAgICAgICAgY2FzZSBTdGF0ZXMucnVuUmlnaHQ6XG4gICAgICAgICAgICByZXR1cm4gbmV3IFJ1blJpZ2h0U3RhdGUocGV0KTtcbiAgICAgICAgY2FzZSBTdGF0ZXMucnVuTGVmdDpcbiAgICAgICAgICAgIHJldHVybiBuZXcgUnVuTGVmdFN0YXRlKHBldCk7XG4gICAgICAgIGNhc2UgU3RhdGVzLmxpZTpcbiAgICAgICAgICAgIHJldHVybiBuZXcgTGllU3RhdGUocGV0KTtcbiAgICAgICAgY2FzZSBTdGF0ZXMud2FsbEhhbmdMZWZ0OlxuICAgICAgICAgICAgcmV0dXJuIG5ldyBXYWxsSGFuZ0xlZnRTdGF0ZShwZXQpO1xuICAgICAgICBjYXNlIFN0YXRlcy5jbGltYldhbGxMZWZ0OlxuICAgICAgICAgICAgcmV0dXJuIG5ldyBDbGltYldhbGxMZWZ0U3RhdGUocGV0KTtcbiAgICAgICAgY2FzZSBTdGF0ZXMuanVtcERvd25MZWZ0OlxuICAgICAgICAgICAgcmV0dXJuIG5ldyBKdW1wRG93bkxlZnRTdGF0ZShwZXQpO1xuICAgICAgICBjYXNlIFN0YXRlcy5sYW5kOlxuICAgICAgICAgICAgcmV0dXJuIG5ldyBMYW5kU3RhdGUocGV0KTtcbiAgICAgICAgY2FzZSBTdGF0ZXMuc3dpcGU6XG4gICAgICAgICAgICByZXR1cm4gbmV3IFN3aXBlU3RhdGUocGV0KTtcbiAgICAgICAgY2FzZSBTdGF0ZXMuaWRsZVdpdGhCYWxsOlxuICAgICAgICAgICAgcmV0dXJuIG5ldyBJZGxlV2l0aEJhbGxTdGF0ZShwZXQpO1xuICAgICAgICBjYXNlIFN0YXRlcy5jaGFzZUZyaWVuZDpcbiAgICAgICAgICAgIHJldHVybiBuZXcgQ2hhc2VGcmllbmRTdGF0ZShwZXQpO1xuICAgIH1cbiAgICByZXR1cm4gbmV3IFNpdElkbGVTdGF0ZShwZXQpO1xufVxuXG5leHBvcnQgaW50ZXJmYWNlIElTdGF0ZSB7XG4gICAgbGFiZWw6IHN0cmluZztcbiAgICBzcHJpdGVMYWJlbDogc3RyaW5nO1xuICAgIGhvcml6b250YWxEaXJlY3Rpb246IEhvcml6b250YWxEaXJlY3Rpb247XG4gICAgcGV0OiBJUGV0VHlwZTtcbiAgICBuZXh0RnJhbWUoKTogRnJhbWVSZXN1bHQ7XG59XG5cbmNsYXNzIEFic3RyYWN0U3RhdGljU3RhdGUgaW1wbGVtZW50cyBJU3RhdGUge1xuICAgIGxhYmVsID0gU3RhdGVzLnNpdElkbGU7XG4gICAgaWRsZUNvdW50ZXI6IG51bWJlcjtcbiAgICBzcHJpdGVMYWJlbCA9ICdpZGxlJztcbiAgICBob2xkVGltZSA9IDUwO1xuICAgIHBldDogSVBldFR5cGU7XG5cbiAgICBob3Jpem9udGFsRGlyZWN0aW9uID0gSG9yaXpvbnRhbERpcmVjdGlvbi5sZWZ0O1xuXG4gICAgY29uc3RydWN0b3IocGV0OiBJUGV0VHlwZSkge1xuICAgICAgICB0aGlzLmlkbGVDb3VudGVyID0gMDtcbiAgICAgICAgdGhpcy5wZXQgPSBwZXQ7XG4gICAgfVxuXG4gICAgbmV4dEZyYW1lKCk6IEZyYW1lUmVzdWx0IHtcbiAgICAgICAgdGhpcy5pZGxlQ291bnRlcisrO1xuICAgICAgICBpZiAodGhpcy5pZGxlQ291bnRlciA+IHRoaXMuaG9sZFRpbWUpIHtcbiAgICAgICAgICAgIHJldHVybiBGcmFtZVJlc3VsdC5zdGF0ZUNvbXBsZXRlO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBGcmFtZVJlc3VsdC5zdGF0ZUNvbnRpbnVlO1xuICAgIH1cbn1cblxuZXhwb3J0IGNsYXNzIFNpdElkbGVTdGF0ZSBleHRlbmRzIEFic3RyYWN0U3RhdGljU3RhdGUge1xuICAgIGxhYmVsID0gU3RhdGVzLnNpdElkbGU7XG4gICAgc3ByaXRlTGFiZWwgPSAnaWRsZSc7XG4gICAgaG9yaXpvbnRhbERpcmVjdGlvbiA9IEhvcml6b250YWxEaXJlY3Rpb24ucmlnaHQ7XG4gICAgaG9sZFRpbWUgPSA1MDtcbn1cblxuZXhwb3J0IGNsYXNzIExpZVN0YXRlIGV4dGVuZHMgQWJzdHJhY3RTdGF0aWNTdGF0ZSB7XG4gICAgbGFiZWwgPSBTdGF0ZXMubGllO1xuICAgIHNwcml0ZUxhYmVsID0gJ2xpZSc7XG4gICAgaG9yaXpvbnRhbERpcmVjdGlvbiA9IEhvcml6b250YWxEaXJlY3Rpb24ucmlnaHQ7XG4gICAgaG9sZFRpbWUgPSA1MDtcbn1cblxuZXhwb3J0IGNsYXNzIFdhbGxIYW5nTGVmdFN0YXRlIGV4dGVuZHMgQWJzdHJhY3RTdGF0aWNTdGF0ZSB7XG4gICAgbGFiZWwgPSBTdGF0ZXMud2FsbEhhbmdMZWZ0O1xuICAgIHNwcml0ZUxhYmVsID0gJ3dhbGxncmFiJztcbiAgICBob3Jpem9udGFsRGlyZWN0aW9uID0gSG9yaXpvbnRhbERpcmVjdGlvbi5sZWZ0O1xuICAgIGhvbGRUaW1lID0gNTA7XG59XG5cbmV4cG9ydCBjbGFzcyBMYW5kU3RhdGUgZXh0ZW5kcyBBYnN0cmFjdFN0YXRpY1N0YXRlIHtcbiAgICBsYWJlbCA9IFN0YXRlcy5sYW5kO1xuICAgIHNwcml0ZUxhYmVsID0gJ2xhbmQnO1xuICAgIGhvcml6b250YWxEaXJlY3Rpb24gPSBIb3Jpem9udGFsRGlyZWN0aW9uLmxlZnQ7XG4gICAgaG9sZFRpbWUgPSAxMDtcbn1cblxuZXhwb3J0IGNsYXNzIFN3aXBlU3RhdGUgZXh0ZW5kcyBBYnN0cmFjdFN0YXRpY1N0YXRlIHtcbiAgICBsYWJlbCA9IFN0YXRlcy5zd2lwZTtcbiAgICBzcHJpdGVMYWJlbCA9ICdzd2lwZSc7XG4gICAgaG9yaXpvbnRhbERpcmVjdGlvbiA9IEhvcml6b250YWxEaXJlY3Rpb24ubmF0dXJhbDtcbiAgICBob2xkVGltZSA9IDE1O1xufVxuXG5leHBvcnQgY2xhc3MgSWRsZVdpdGhCYWxsU3RhdGUgZXh0ZW5kcyBBYnN0cmFjdFN0YXRpY1N0YXRlIHtcbiAgICBsYWJlbCA9IFN0YXRlcy5pZGxlV2l0aEJhbGw7XG4gICAgc3ByaXRlTGFiZWwgPSAnd2l0aF9iYWxsJztcbiAgICBob3Jpem9udGFsRGlyZWN0aW9uID0gSG9yaXpvbnRhbERpcmVjdGlvbi5sZWZ0O1xuICAgIGhvbGRUaW1lID0gMzA7XG59XG5cbmV4cG9ydCBjbGFzcyBXYWxrUmlnaHRTdGF0ZSBpbXBsZW1lbnRzIElTdGF0ZSB7XG4gICAgbGFiZWwgPSBTdGF0ZXMud2Fsa1JpZ2h0O1xuICAgIHBldDogSVBldFR5cGU7XG4gICAgc3ByaXRlTGFiZWwgPSAnd2Fsayc7XG4gICAgaG9yaXpvbnRhbERpcmVjdGlvbiA9IEhvcml6b250YWxEaXJlY3Rpb24ucmlnaHQ7XG4gICAgbGVmdEJvdW5kYXJ5OiBudW1iZXI7XG4gICAgc3BlZWRNdWx0aXBsaWVyID0gMTtcbiAgICBpZGxlQ291bnRlcjogbnVtYmVyO1xuICAgIGhvbGRUaW1lID0gNjA7XG5cbiAgICBjb25zdHJ1Y3RvcihwZXQ6IElQZXRUeXBlKSB7XG4gICAgICAgIHRoaXMubGVmdEJvdW5kYXJ5ID0gTWF0aC5mbG9vcih3aW5kb3cuaW5uZXJXaWR0aCAqIDAuOTUpO1xuICAgICAgICB0aGlzLnBldCA9IHBldDtcbiAgICAgICAgdGhpcy5pZGxlQ291bnRlciA9IDA7XG4gICAgfVxuXG4gICAgbmV4dEZyYW1lKCk6IEZyYW1lUmVzdWx0IHtcbiAgICAgICAgdGhpcy5pZGxlQ291bnRlcisrO1xuICAgICAgICB0aGlzLnBldC5wb3NpdGlvbkxlZnQoXG4gICAgICAgICAgICB0aGlzLnBldC5sZWZ0ICsgdGhpcy5wZXQuc3BlZWQgKiB0aGlzLnNwZWVkTXVsdGlwbGllcixcbiAgICAgICAgKTtcbiAgICAgICAgaWYgKFxuICAgICAgICAgICAgdGhpcy5wZXQuaXNNb3ZpbmcgJiZcbiAgICAgICAgICAgIHRoaXMucGV0LmxlZnQgPj0gdGhpcy5sZWZ0Qm91bmRhcnkgLSB0aGlzLnBldC53aWR0aFxuICAgICAgICApIHtcbiAgICAgICAgICAgIHJldHVybiBGcmFtZVJlc3VsdC5zdGF0ZUNvbXBsZXRlO1xuICAgICAgICB9IGVsc2UgaWYgKCF0aGlzLnBldC5pc01vdmluZyAmJiB0aGlzLmlkbGVDb3VudGVyID4gdGhpcy5ob2xkVGltZSkge1xuICAgICAgICAgICAgcmV0dXJuIEZyYW1lUmVzdWx0LnN0YXRlQ29tcGxldGU7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIEZyYW1lUmVzdWx0LnN0YXRlQ29udGludWU7XG4gICAgfVxufVxuXG5leHBvcnQgY2xhc3MgV2Fsa0xlZnRTdGF0ZSBpbXBsZW1lbnRzIElTdGF0ZSB7XG4gICAgbGFiZWwgPSBTdGF0ZXMud2Fsa0xlZnQ7XG4gICAgc3ByaXRlTGFiZWwgPSAnd2Fsayc7XG4gICAgaG9yaXpvbnRhbERpcmVjdGlvbiA9IEhvcml6b250YWxEaXJlY3Rpb24ubGVmdDtcbiAgICBwZXQ6IElQZXRUeXBlO1xuICAgIHNwZWVkTXVsdGlwbGllciA9IDE7XG4gICAgaWRsZUNvdW50ZXI6IG51bWJlcjtcbiAgICBob2xkVGltZSA9IDYwO1xuXG4gICAgY29uc3RydWN0b3IocGV0OiBJUGV0VHlwZSkge1xuICAgICAgICB0aGlzLnBldCA9IHBldDtcbiAgICAgICAgdGhpcy5pZGxlQ291bnRlciA9IDA7XG4gICAgfVxuXG4gICAgbmV4dEZyYW1lKCk6IEZyYW1lUmVzdWx0IHtcbiAgICAgICAgdGhpcy5wZXQucG9zaXRpb25MZWZ0KFxuICAgICAgICAgICAgdGhpcy5wZXQubGVmdCAtIHRoaXMucGV0LnNwZWVkICogdGhpcy5zcGVlZE11bHRpcGxpZXIsXG4gICAgICAgICk7XG4gICAgICAgIGlmICh0aGlzLnBldC5pc01vdmluZyAmJiB0aGlzLnBldC5sZWZ0IDw9IDApIHtcbiAgICAgICAgICAgIHJldHVybiBGcmFtZVJlc3VsdC5zdGF0ZUNvbXBsZXRlO1xuICAgICAgICB9IGVsc2UgaWYgKCF0aGlzLnBldC5pc01vdmluZyAmJiB0aGlzLmlkbGVDb3VudGVyID4gdGhpcy5ob2xkVGltZSkge1xuICAgICAgICAgICAgcmV0dXJuIEZyYW1lUmVzdWx0LnN0YXRlQ29tcGxldGU7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIEZyYW1lUmVzdWx0LnN0YXRlQ29udGludWU7XG4gICAgfVxufVxuXG5leHBvcnQgY2xhc3MgUnVuUmlnaHRTdGF0ZSBleHRlbmRzIFdhbGtSaWdodFN0YXRlIHtcbiAgICBsYWJlbCA9IFN0YXRlcy5ydW5SaWdodDtcbiAgICBzcHJpdGVMYWJlbCA9ICd3YWxrX2Zhc3QnO1xuICAgIHNwZWVkTXVsdGlwbGllciA9IDEuNjtcbiAgICBob2xkVGltZSA9IDEzMDtcbn1cblxuZXhwb3J0IGNsYXNzIFJ1bkxlZnRTdGF0ZSBleHRlbmRzIFdhbGtMZWZ0U3RhdGUge1xuICAgIGxhYmVsID0gU3RhdGVzLnJ1bkxlZnQ7XG4gICAgc3ByaXRlTGFiZWwgPSAnd2Fsa19mYXN0JztcbiAgICBzcGVlZE11bHRpcGxpZXIgPSAxLjY7XG4gICAgaG9sZFRpbWUgPSAxMzA7XG59XG5cbmV4cG9ydCBjbGFzcyBDaGFzZVN0YXRlIGltcGxlbWVudHMgSVN0YXRlIHtcbiAgICBsYWJlbCA9IFN0YXRlcy5jaGFzZTtcbiAgICBzcHJpdGVMYWJlbCA9ICdydW4nO1xuICAgIGhvcml6b250YWxEaXJlY3Rpb24gPSBIb3Jpem9udGFsRGlyZWN0aW9uLmxlZnQ7XG4gICAgYmFsbFN0YXRlOiBCYWxsU3RhdGU7XG4gICAgY2FudmFzOiBIVE1MQ2FudmFzRWxlbWVudDtcbiAgICBwZXQ6IElQZXRUeXBlO1xuXG4gICAgY29uc3RydWN0b3IoXG4gICAgICAgIHBldDogSVBldFR5cGUsXG4gICAgICAgIGJhbGxTdGF0ZTogQmFsbFN0YXRlLFxuICAgICAgICBjYW52YXM6IEhUTUxDYW52YXNFbGVtZW50LFxuICAgICkge1xuICAgICAgICB0aGlzLnBldCA9IHBldDtcbiAgICAgICAgdGhpcy5iYWxsU3RhdGUgPSBiYWxsU3RhdGU7XG4gICAgICAgIHRoaXMuY2FudmFzID0gY2FudmFzO1xuICAgIH1cblxuICAgIG5leHRGcmFtZSgpOiBGcmFtZVJlc3VsdCB7XG4gICAgICAgIGlmICh0aGlzLmJhbGxTdGF0ZS5wYXVzZWQpIHtcbiAgICAgICAgICAgIHJldHVybiBGcmFtZVJlc3VsdC5zdGF0ZUNhbmNlbDsgLy8gQmFsbCBpcyBhbHJlYWR5IGNhdWdodFxuICAgICAgICB9XG4gICAgICAgIGlmICh0aGlzLnBldC5sZWZ0ID4gdGhpcy5iYWxsU3RhdGUuY3gpIHtcbiAgICAgICAgICAgIHRoaXMuaG9yaXpvbnRhbERpcmVjdGlvbiA9IEhvcml6b250YWxEaXJlY3Rpb24ubGVmdDtcbiAgICAgICAgICAgIHRoaXMucGV0LnBvc2l0aW9uTGVmdCh0aGlzLnBldC5sZWZ0IC0gdGhpcy5wZXQuc3BlZWQpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5ob3Jpem9udGFsRGlyZWN0aW9uID0gSG9yaXpvbnRhbERpcmVjdGlvbi5yaWdodDtcbiAgICAgICAgICAgIHRoaXMucGV0LnBvc2l0aW9uTGVmdCh0aGlzLnBldC5sZWZ0ICsgdGhpcy5wZXQuc3BlZWQpO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKFxuICAgICAgICAgICAgdGhpcy5jYW52YXMuaGVpZ2h0IC0gdGhpcy5iYWxsU3RhdGUuY3kgPFxuICAgICAgICAgICAgICAgIHRoaXMucGV0LndpZHRoICsgdGhpcy5wZXQuZmxvb3IgJiZcbiAgICAgICAgICAgIHRoaXMuYmFsbFN0YXRlLmN4IDwgdGhpcy5wZXQubGVmdCAmJlxuICAgICAgICAgICAgdGhpcy5wZXQubGVmdCA8IHRoaXMuYmFsbFN0YXRlLmN4ICsgMTVcbiAgICAgICAgKSB7XG4gICAgICAgICAgICAvLyBoaWRlIGJhbGxcbiAgICAgICAgICAgIHRoaXMuY2FudmFzLnN0eWxlLmRpc3BsYXkgPSAnbm9uZSc7XG4gICAgICAgICAgICB0aGlzLmJhbGxTdGF0ZS5wYXVzZWQgPSB0cnVlO1xuICAgICAgICAgICAgcmV0dXJuIEZyYW1lUmVzdWx0LnN0YXRlQ29tcGxldGU7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIEZyYW1lUmVzdWx0LnN0YXRlQ29udGludWU7XG4gICAgfVxufVxuXG5leHBvcnQgY2xhc3MgQ2hhc2VGcmllbmRTdGF0ZSBpbXBsZW1lbnRzIElTdGF0ZSB7XG4gICAgbGFiZWwgPSBTdGF0ZXMuY2hhc2VGcmllbmQ7XG4gICAgc3ByaXRlTGFiZWwgPSAncnVuJztcbiAgICBob3Jpem9udGFsRGlyZWN0aW9uID0gSG9yaXpvbnRhbERpcmVjdGlvbi5sZWZ0O1xuICAgIHBldDogSVBldFR5cGU7XG5cbiAgICBjb25zdHJ1Y3RvcihwZXQ6IElQZXRUeXBlKSB7XG4gICAgICAgIHRoaXMucGV0ID0gcGV0O1xuICAgIH1cblxuICAgIG5leHRGcmFtZSgpOiBGcmFtZVJlc3VsdCB7XG4gICAgICAgIGlmICghdGhpcy5wZXQuaGFzRnJpZW5kIHx8ICF0aGlzLnBldC5mcmllbmQ/LmlzUGxheWluZykge1xuICAgICAgICAgICAgcmV0dXJuIEZyYW1lUmVzdWx0LnN0YXRlQ2FuY2VsOyAvLyBGcmllbmQgaXMgbm8gbG9uZ2VyIHBsYXlpbmcuXG4gICAgICAgIH1cbiAgICAgICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIEB0eXBlc2NyaXB0LWVzbGludC9uby1ub24tbnVsbC1hc3NlcnRpb25cbiAgICAgICAgaWYgKHRoaXMucGV0LmxlZnQgPiB0aGlzLnBldC5mcmllbmQhLmxlZnQpIHtcbiAgICAgICAgICAgIHRoaXMuaG9yaXpvbnRhbERpcmVjdGlvbiA9IEhvcml6b250YWxEaXJlY3Rpb24ubGVmdDtcbiAgICAgICAgICAgIHRoaXMucGV0LnBvc2l0aW9uTGVmdCh0aGlzLnBldC5sZWZ0IC0gdGhpcy5wZXQuc3BlZWQpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5ob3Jpem9udGFsRGlyZWN0aW9uID0gSG9yaXpvbnRhbERpcmVjdGlvbi5yaWdodDtcbiAgICAgICAgICAgIHRoaXMucGV0LnBvc2l0aW9uTGVmdCh0aGlzLnBldC5sZWZ0ICsgdGhpcy5wZXQuc3BlZWQpO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIEZyYW1lUmVzdWx0LnN0YXRlQ29udGludWU7XG4gICAgfVxufVxuXG5leHBvcnQgY2xhc3MgQ2xpbWJXYWxsTGVmdFN0YXRlIGltcGxlbWVudHMgSVN0YXRlIHtcbiAgICBsYWJlbCA9IFN0YXRlcy5jbGltYldhbGxMZWZ0O1xuICAgIHNwcml0ZUxhYmVsID0gJ3dhbGxjbGltYic7XG4gICAgaG9yaXpvbnRhbERpcmVjdGlvbiA9IEhvcml6b250YWxEaXJlY3Rpb24ubGVmdDtcbiAgICBwZXQ6IElQZXRUeXBlO1xuXG4gICAgY29uc3RydWN0b3IocGV0OiBJUGV0VHlwZSkge1xuICAgICAgICB0aGlzLnBldCA9IHBldDtcbiAgICB9XG5cbiAgICBuZXh0RnJhbWUoKTogRnJhbWVSZXN1bHQge1xuICAgICAgICB0aGlzLnBldC5wb3NpdGlvbkJvdHRvbSh0aGlzLnBldC5ib3R0b20gKyAxKTtcbiAgICAgICAgaWYgKHRoaXMucGV0LmJvdHRvbSA+PSAxMDApIHtcbiAgICAgICAgICAgIHJldHVybiBGcmFtZVJlc3VsdC5zdGF0ZUNvbXBsZXRlO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBGcmFtZVJlc3VsdC5zdGF0ZUNvbnRpbnVlO1xuICAgIH1cbn1cblxuZXhwb3J0IGNsYXNzIEp1bXBEb3duTGVmdFN0YXRlIGltcGxlbWVudHMgSVN0YXRlIHtcbiAgICBsYWJlbCA9IFN0YXRlcy5qdW1wRG93bkxlZnQ7XG4gICAgc3ByaXRlTGFiZWwgPSAnZmFsbF9mcm9tX2dyYWInO1xuICAgIGhvcml6b250YWxEaXJlY3Rpb24gPSBIb3Jpem9udGFsRGlyZWN0aW9uLnJpZ2h0O1xuICAgIHBldDogSVBldFR5cGU7XG5cbiAgICBjb25zdHJ1Y3RvcihwZXQ6IElQZXRUeXBlKSB7XG4gICAgICAgIHRoaXMucGV0ID0gcGV0O1xuICAgIH1cblxuICAgIG5leHRGcmFtZSgpOiBGcmFtZVJlc3VsdCB7XG4gICAgICAgIHRoaXMucGV0LnBvc2l0aW9uQm90dG9tKHRoaXMucGV0LmJvdHRvbSAtIDUpO1xuICAgICAgICBpZiAodGhpcy5wZXQuYm90dG9tIDw9IHRoaXMucGV0LmZsb29yKSB7XG4gICAgICAgICAgICB0aGlzLnBldC5wb3NpdGlvbkJvdHRvbSh0aGlzLnBldC5mbG9vcik7XG4gICAgICAgICAgICByZXR1cm4gRnJhbWVSZXN1bHQuc3RhdGVDb21wbGV0ZTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gRnJhbWVSZXN1bHQuc3RhdGVDb250aW51ZTtcbiAgICB9XG59XG4iXSwibmFtZXMiOltdLCJzb3VyY2VSb290IjoiIn0=