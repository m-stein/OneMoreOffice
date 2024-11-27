import { makeRandomSelection } from "./array_utilities.js";

export class MusicPlayer
{
    constructor()
    {
        this.listedItems = [];
        this.playingItems = [];
        this.playingItemIdx = 0;
        this.playing = false;
        this.volume = 0.1;
    }

    addItem(item)
    {
        this.listedItems.push(item);
    }

    playItem(item)
    {
        item.volume = this.volume;
        item.loop = false;
        item.addEventListener('ended', this.onItemPlaybackEnded);
        item.play();
    }

    play()
    {
        if (this.playing) {
            return;
        }
        if (this.listedItems.length == 0) {
            console.warn("Warning: MusicPlayer.Play: No items listed");
            return;
        }
        this.playingItems = makeRandomSelection(this.listedItems, this.listedItems.length);
        this.playingItemIdx = 0;
        this.playItem(this.playingItems[this.playingItemIdx]);
        this.playing = true;
    }

    onItemPlaybackEnded = () =>
    {
        this.playingItemIdx = (this.playingItemIdx + 1) % this.playingItems.length;
        this.playItem(this.playingItems[this.playingItemIdx]);
    }
}