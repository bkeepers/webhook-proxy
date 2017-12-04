# Webhook Proxy

This is a proof of concept for proxying webhooks to a development environment that is not accessible to the outside world.

1. Go to http://github-webhook-proxy.herokuapp.com/, which will redirect you to a randomly generated channel.

1. Use this as your **Webhook URL**

1. Connect to the URL with a client that supports [Server-Sent Events](https://developer.mozilla.org/en-US/docs/Web/API/Server-sent_events/Using_server-sent_events).

    Such as a Browser:

    ```
    const events = new EventSource("http://github-webhook-proxy.herokuapp.com/yourtoken")
    events.onmessage = (msg) => {
      console.log(msg.data)
    }
    ```

    Or Curl:

    ```
    curl -i -H 'Accept: text/event-stream' http://github-webhook-proxy.herokuapp.com/yourtoken
    ```

1. Watch as webhooks are relayed.
