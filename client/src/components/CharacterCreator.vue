<template>
  <div class="character-creator">
    <h1>Character Creator</h1>
    <label for="character-name">Character Name: </label>
    <input
      type="text"
      id="character-name"
      v-model="name"
      placeholder="Enter a name"
    />
    <br /><br />
    <label for="professions-list">Character Profession: </label>
    <select id="professions-list" v-model="profession">
      <option value="Mage">Mage</option>
      <option value="Thief">Thief</option>
      <option value="Warrior">Warrior</option></select
    ><br /><br />
    <input type="file" accept="image/*" ref="file" @change="selectImage" />

    <br /><br />

    <div v-if="previewImage">
      <div>
        <img class="preview mt-3" :src="previewImage" alt="" />
      </div>

      <br /><br />
    </div>

    <button v-on:click="postCharacter">Create Character</button>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "CharacterCreator",
  data: function () {
    return {
      name: null,
      profession: null,
      currentImage: undefined,
      previewImage: undefined,
    };
  },
  methods: {
    postCharacter: function () {
      axios.post("http://localhost:3000/characters", {
        name: this.name,
        profession: this.profession,
        image: this.currentImage,
      });
    },
    selectImage() {
      const file = this.$refs.file.files.item(0);

      const reader = new FileReader();
      reader.onloadend = () => {
        this.currentImage = reader.result;
        console.log(this.currentImage);
      };
      reader.readAsDataURL(file);
      console.log(file);

      this.previewImage = URL.createObjectURL(file);
    },
  },
};
</script>


<style scoped>
.preview {
  max-width: 200px;
}
</style>
