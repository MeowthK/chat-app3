<script lang="ts">
    import { onMount } from "svelte";
    import image from "./../resources/avatar.png"

    let avatarCoord = { x: 0, y: 0 }

    onMount(() => {updateImage()})

    const updateImage = () => {
        let img = new Image()
        
        img.onload = () => {
            let canvas = document.getElementById("drawingArea") as HTMLCanvasElement
            canvas.getContext("2d").drawImage(img, -avatarCoord.x * 64, -avatarCoord.y * 64, 256, 256)
        }

        img.src = image
    }

    const shiftLeft = () => {

        avatarCoord.x -= 1

        if (avatarCoord.x < 0) {
            avatarCoord.x = 3

            avatarCoord.y -= 1
            
            if (avatarCoord.y < 0)
                avatarCoord.y = 3
        }

        updateImage()
    }

    const shiftRight = () => {

        avatarCoord.x += 1

        if (avatarCoord.x > 3) {
            avatarCoord.x = 0
            
            avatarCoord.y += 1

            if (avatarCoord.y > 3)
                avatarCoord.y = 0
        }

        updateImage()
    }

</script>

<div class="container">
    <h2>Register to start sending messages</h2>
    <form method="POST">
        <input class="d-none" name="avatar-coordx" bind:value={avatarCoord.x}/>
        <input class="d-none" name="avatar-coordy" bind:value={avatarCoord.y}/>
        <input name="username" id="username" required class="form-control mt-1" type="text" placeholder="Username"/>
        <input name="password" id="password" required class="form-control mt-1" type="password" placeholder="Password"/>
        <input id="password2" required class="form-control mt-1" type="password" placeholder="Confirm Password"/>
        <div>
            <h6 class="mt-3">Select an avatar:</h6>
            <table class="mt-3 mb-3">
                <tbody>
                    <tr>
                        <td><button type="button" on:click={shiftLeft} class="btnSimple">←</button></td>
                        <td><canvas width="64" height="64" id="drawingArea" /></td>
                        <td><button type="button" on:click={shiftRight} class="btnSimple">→</button></td>
                    </tr>
                </tbody>
            </table>
        </div>
        <button class="btn btn-primary mt-1" on:submit|preventDefault type="submit">Register</button>
        <a class="btn btn-primary mt-1" href="/login">Already Registered?</a>
    </form>
</div>

<style>
    .btnSimple {
        border-radius: 50%;
        border-color: beige;
        background-color: transparent;
        width: 32px;
        height: 32px;
    }
</style>