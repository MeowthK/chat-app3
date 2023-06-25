<script lang="ts">

    import ChatBubble from "$lib/ChatBubble.svelte"
    import Contact from "$lib/Contact.svelte"
    import { onMount } from "svelte"
    import Pusher from 'pusher-js'
    import { PUBLIC_PUSHER_KEY } from "$env/static/public"
    import image from "./../../../resources/avatar.png"

    export let data

    let avatarCoord = { x: 0, y: 0 }

    const updateImage = () => {

        const found = users.filter(u => u.username === recipient && u.avatar)

        if (found) {

            const f_user = found[0]

            avatarCoord.x = f_user.avatar.x
            avatarCoord.y = f_user.avatar.y
        }

        let img = new Image()
        
        img.onload = () => {
            let canvas = document.getElementById("avatar") as HTMLCanvasElement
            canvas.getContext("2d").drawImage(img, -avatarCoord.x * 64, -avatarCoord.y * 64, 256, 256)
        }

        img.src = image
    }

    let parsedSlug = JSON.parse(data.slug)
    const sender = parsedSlug.username
    const dbchats = parsedSlug.chats
    const users = parsedSlug.users

    let message = ''
    let recipient = sender
    let chats = []
    let searchFilter = ''

    dbchats.forEach(el => {
        const chat = {
            sender: el.origin,
            recipient: el.destination,
            message: el.message,
            timestamp: el.timestamp
        }

        chats = [chat, ...chats]
    })

    const chatInContext = (_cdata, _cuser) => {
        return _cdata.recipient === _cuser || _cdata.sender === _cuser
    }

    onMount(() => {
        
        updateImage()

        Pusher.logToConsole = true;

        new Pusher(PUBLIC_PUSHER_KEY, {
            cluster: 'ap1'
        })
        .subscribe('chat-channel')
        .bind('chat', (/** @type {any} */ data) => {
            if (chatInContext(data, sender))
                chats = [data, ...chats]
        })
    })

    const send = async () => {

        if (recipient.trim().length === 0 || message.trim().length === 0)
            return

        const chatjson = {
			sender, recipient, message, timestamp: Date.now()
		}

        await fetch('?/send', {
			method: 'POST',
			body: JSON.stringify(chatjson)
		})

        message = ''
    }

    const handleKeyDown = async (e) => {
        if (e.key === "Enter")
        {
            if (e.shifKey)
                message += "\r\n"
            
            else await send()
        }
    }

    const changeRecipient = ({detail}) => {
        recipient = detail
        updateImage()
    }

    const logout = async () => {
        await fetch('?/logout',{method: 'POST', body: ''})
        location.assign('/')
    }

</script>

<div class="nospacing full-height">
    <table class="nospacing full-width full-height">
        <tbody>
            <tr class="navheight">
                <td class="radius-topleft sidebar-color">
                    <input bind:value={searchFilter} class="form-control" type="text" placeholder="Search Contact" />
                </td>
                <td class="nospacing">
                    <table class="nospacing full-width full-height">
                        <tbody>
                            <tr>
                                <td class="avatar-box">
                                    <canvas id="avatar" width="64px" height="64px" />
                                </td>
                                <td>
                                <div class="underlined d-flex">
                                    <h4 class="mt-2 flex-grow-1">From {recipient === sender ? "You" : recipient}</h4>
                                    <button on:click={logout} class="btn btn-danger">Log out</button>
                                </div>
                            </td>
                            </tr>
                        </tbody>
                    </table>
                </td>
            </tr>
            <tr>
                <td class="sidebar sidebar-color">
                    <div class="col d-flex flex-column sidebar full-height scrollable">
                        {#each users as contact}
                            {#if contact.username.toLowerCase().includes(searchFilter.toLowerCase())}
                                <Contact on:click={changeRecipient} username={contact.username} />
                            {/if}
                        {/each}
                    </div>
                </td>
                <td>
                    <div class="flex-grow-1 chatbox full-height">
                        {#each chats as chat}
                            {#if chatInContext(chat, recipient)}
                                <ChatBubble self={chat.sender == sender} message={chat.message} timestamp={new Date(chat.timestamp).toLocaleString()} />
                            {/if}
                        {/each}
                    </div>
                </td>
            </tr>
            <tr class="navheight">
                <td class="radius-bottomleft sidebar-color">
                    <input class="form-control" type="text" placeholder="Add Contact" />
                </td>
                <td>
                    <div class="full-width">
                        <div class="d-flex flex-row">
                            <textarea on:keypress={handleKeyDown} class="form-control inputbox me-1" bind:value={message} placeholder="Sending message as {sender}" />
                            <button on:click={send} class="btn btn-primary">Send</button>
                        </div>
                    </div>
                </td>
            </tr>
        </tbody>
    </table>
</div>

<style>
    td {
        padding: 15px;
    }

    .avatar-box {
        width: 64px;
        height: 64px;
    }

    .sidebar {
        width: 250px;
    }

    .radius-topleft {
        border-radius: 15px 0px 0px 0px;
    }

    .radius-bottomleft {
        border-radius: 0px 0px 0px 15px;
    }

    .sidebar-color {
        background-color: slategray;
    }

    .navheight {
        height: 60px;
    }

    .nospacing {
        margin: 0px;
        padding: 0px;
    }

    .underlined {
        border-style:solid;
        border-top: 0px;
        border-left: 0px;
        border-right: 0px;
        border-width: 2px;
        border-color: slategray;
        padding-bottom: 4px;
    }

    .scrollable {
        overflow-y: auto;
    }

    .chatbox {
        overflow-y: auto;
        display: flex;
        flex-direction: column-reverse;
        margin-top: 15px;
        margin-bottom: 8px;
    }

    .full-width {
        width: 100%;
    }

    .full-height {
        min-height: 100%;
        max-height: 100%;
        height: 100%;
    }
    
    .inputbox {
        height: 15px;
        resize: none;
        overflow: hidden;
    }
</style>