<template>
  <div style="margin: 20px;">

      <q-card flat bordered class="my-card">

          <q-card-section>
              <div class="text-h6">PubSub - Publish and Subscribe</div>
          </q-card-section>

          <q-card-section>
              <p>Shows how to mix Meteor pubsub with Vue and Quasar.</p>
              <p><strong>N.B.</strong> This works out of the box on desktop.
                  If you want it to work on a mobile device you will have to set up
                  a server, which is beyond the scope of this demonstration.</p>
          </q-card-section>

      </q-card>


      <q-separator inset />

      <q-card flat bordered class="my-card">

          <q-card-section>
              <div class="text-h6">Session</div>
          </q-card-section>

          <q-card-section>
              <p>Shows how to use Meteor sessions with Vue and Quasar.</p>
          </q-card-section>

      </q-card>

  </div>
</template>


<script>
    //swap the comment on these lines if you want to compile for ios
    import {
        QCard,
        QCardTitle,
        QCardMain,
        QCardSection,
        QSeparator
    } from 'quasar';


    export default {
        components: {
            QCard,
            QCardTitle,
            QCardMain,
            QCardSection,
            QSeparator
        }
    }

</script>