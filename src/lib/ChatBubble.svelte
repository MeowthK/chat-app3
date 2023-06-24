<script>
    export let message, timestamp, self = true
    $:classModifier = self? "align-right" : ""
</script>

<div class='d-flex mt-1 {classModifier}'>
    <div class="p-3 card">
        <span class="card-text">{message}</span>
        <span class="timestamp">Sent {timestamp}</span>
    </div>
</div>

<style>
    span {
        white-space: pre-line;
    }

    .card {
        color: black;
        background-color: lightblue;
        border-radius: 20px;
    }

    .card-text {
        margin-bottom: -1px;
    }

    .timestamp {
        font-size: 12px;
        font-style: italic;
        text-align: end;
    }

    .align-right {
        flex-direction: row-reverse;
    }
</style>