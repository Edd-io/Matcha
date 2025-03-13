/* ************************************************************************** */
/*                                                                            */
/*                                                        :::      ::::::::   */
/*   callFunctions.ts                                   :+:      :+:    :+:   */
/*                                                    +:+ +:+         +:+     */
/*   By: edbernar <edbernar@student.42angouleme.    +#+  +:+       +#+        */
/*                                                +#+#+#+#+#+   +#+           */
/*   Created: 2025/03/11 10:01:52 by edbernar          #+#    #+#             */
/*   Updated: 2025/03/12 17:55:23 by edbernar         ###   ########.fr       */
/*                                                                            */
/* ************************************************************************** */

const audioContext = new AudioContext();
let mediaSource: MediaSource | null = null;
let sourceBuffer: SourceBuffer | null = null;
let audioElement: HTMLAudioElement | null = null;

export async function callFunctions(data: any)
{
	let event:any = null;

    if (data.action === "incoming")
        event = new CustomEvent("incomingCall", { detail: { user1: data.content.user1, user2: data.content.user2 } });
    else if (data.action === "end")
        event = new CustomEvent("endCall", {});
    else if (data.action === "inCall")
        event = new CustomEvent("inCall", {});
    else if (data.action === "calling")
        event = new CustomEvent("calling", { detail: { user1: data.content.user2, user2: data.content.user1 } });
    else if (data.action === "voiceData")
	{
        if (!mediaSource) {
            await initializeAudioPlayer();
        }
        await appendAudioData(data.data);
    }
	if (event !== null)
		document.dispatchEvent(event);
}

async function initializeAudioPlayer()
{
    audioElement = document.createElement('audio');
    document.body.appendChild(audioElement);
    
    mediaSource = new MediaSource();
    audioElement.src = URL.createObjectURL(mediaSource);

    return new Promise<void>((resolve) => {
        mediaSource!.addEventListener('sourceopen', () => {
            sourceBuffer = mediaSource!.addSourceBuffer('audio/webm; codecs=opus');
            sourceBuffer.mode = 'sequence';
            resolve();
        });
    });
}

async function appendAudioData(arrayBuffer: ArrayBuffer)
{
    if (!sourceBuffer || sourceBuffer.updating)
		{
        await new Promise(resolve => setTimeout(resolve, 50));
        return appendAudioData(arrayBuffer);
    }
    return new Promise<void>((resolve, reject) => {
        const onUpdateEnd = () => {
            sourceBuffer!.removeEventListener('updateend', onUpdateEnd);
            resolve();
        };
        const onError = (e: Event) => {
            sourceBuffer!.removeEventListener('error', onError);
            reject(new Error('Erreur SourceBuffer'));
        };

        sourceBuffer?.addEventListener('updateend', onUpdateEnd);
        sourceBuffer?.addEventListener('error', onError);
        
        try {
            sourceBuffer?.appendBuffer(arrayBuffer);
            audioElement?.play().catch(console.error);
        } catch (e) {
            reject(e);
        }
    });
}
