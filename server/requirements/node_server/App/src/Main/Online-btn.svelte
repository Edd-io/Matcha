<script>
    let isOnline = false;
</script>

<main>
    <div class={isOnline === false ? "is-online" : "is-offline"}></div>
</main>

<style>

    .is-online {
        position: absolute;
        top: 0;
        right: 0;
        width: .8rem;
        height: .8rem;
        background-color: green;
        border-radius: 50%;
    }

    .is-offline {
        position: absolute;
        top: 0;
        right: 0;
        width: .8rem;
        height: .8rem;
        background-color: #c64141;
        border-radius: 50%;
    }
</style>