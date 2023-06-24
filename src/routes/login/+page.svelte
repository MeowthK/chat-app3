<script>
    let username = ''
    let password = ''

    const submit = () => {

    }
</script>

<div class="container">
    <h2>Login to start messaging</h2>

    <form method="POST">
        <input name="username" bind:value={username} class="form-control mt-1" type="text" placeholder="Username" />
        <input name="password" bind:value={password} class="form-control mt-1" type="password" placeholder="Password" />
        <button on:submit|preventDefault={submit} class="btn btn-primary mt-1">Log In</button>
        <a class="btn btn-primary mt-1" href="/">Create New Account</a>
    </form>
</div>
