<script>
    
    import { createEventDispatcher } from "svelte";

    export let username = ''

    const dispatch = createEventDispatcher()
    const returnUser = () => {
        dispatch('click', username)
    }

</script>

<button on:click={returnUser} class="btn btn-primary mb-1">{username}</button>