// kaomoji.mjs
class Kaomoji {
    constructor(value, emotions) {
        this.value = value;
        this.emotions = emotions;
    }
    isEmotion(emotion) {
        return this.emotions.includes(emotion);
    }
}

export {
    Kaomoji
};