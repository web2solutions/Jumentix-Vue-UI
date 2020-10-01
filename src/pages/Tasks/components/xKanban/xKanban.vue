<template>
  <div class="card-scene">
    <!-- <Container
      orientation="horizontal"
      @drop="onColumnDrop($event)"
      drag-handle-selector=".column-drag-handle"
      @drag-start="dragStart"
      :drop-placeholder="upperDropPlaceholderOptions"
    >
      <Draggable v-for="stage in stages" :key="stage">
        <div class="card-container">
          <div class="card-column-header">
            <span class="column-drag-handle">&#x2630;</span>
            {{ stage }}
          </div>
          <Container
            group-name="col"
            @drag-start="(e) => log('drag start', e)"
            @drag-end="(e) => log('drag end', e)"
            drag-class="card-ghost"
            drop-class="card-ghost-drop"
            :drop-placeholder="dropPlaceholderOptions"
          >
            <Draggable v-for="card in getBlocks(stage)" :key="card.id">
              <div class="card">
                <p>{{ card.id }}</p>
              </div>
            </Draggable>
          </Container>
          <div class="drag-column-footer">
            <slot :name="`footer-${stage}`">ADD TASK</slot>
          </div>
        </div>
      </Draggable>
    </Container> -->
    <Container
      orientation="horizontal"
      @drop="onColumnDrop($event)"
      drag-handle-selector=".column-drag-handle"
      @drag-start="dragStart"
      :drop-placeholder="upperDropPlaceholderOptions"
    >
      <Draggable v-for="column in scene.children" :key="column.id">
        <div :class="column.props.className">
          <div class="card-column-header">
            <span class="column-drag-handle">&#x2630;</span>
            {{ column.name }}
          </div>
          <Container
            group-name="col"
            @drop="(e) => onCardDrop(column.id, e, column.statusID, column.name, column.children)"
            @drag-start="(e) => log('drag start', e)"
            @drag-end="(e) => log('drag end', e)"
            :get-child-payload="getCardPayload(column.id)"
            drag-class="card-ghost"
            drop-class="card-ghost-drop"
            :drop-placeholder="dropPlaceholderOptions"
          >
            <Draggable v-for="card in column.children" :key="card.id">
              <div :class="card.props.className" :style="card.props.style" @click.prevent="() => bus.$emit('cardClick', card.data.id, card.data.status)">
                <div>
                  <strong>{{ card.data.name }}</strong>
                </div>
                <div>{{ card.data.description }}</div>

                <div class="text-xs-right TaskAvatar">
                  <v-avatar
                    :size="25"
                  >
                    <img src="/static/avatar.png" alt="Admins Last Name">
                  </v-avatar>
                </div>
              </div>
            </Draggable>
          </Container>
          <div class="drag-column-footer">
            <slot :name="`footer-${column.name}`">ADD TASK {{column.name}}</slot>
          </div>
        </div>
      </Draggable>
    </Container>
  </div>
</template>

<script>
import xKanban from './xKanban.vm.js';

export default xKanban;
</script>
