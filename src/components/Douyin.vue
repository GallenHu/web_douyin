<template>
  <div>
    <x-header :left-options="leftOptions" class="header" @on-click-back="onBackClick">{{source === 1?'抖音' : '快手'}}Web版<a slot="right" @click="refresh">刷新</a></x-header>
    <div class="wrapper" v-for="(item, index) in options" :key="index">
      <video-player class="video-player-box"
                 ref="videoPlayer"
                 :options="item"
                 :playsinline="true"
                 @canplay="onPlayerCanplay($event)"
                >
      </video-player>
      <p>标题：{{item.__desc}}</p>
      <p>用户：{{item.__nickname}}</p>
      <p>分享：{{item.__share_url}}</p>
    </div>

  </div>

</template>

<script>
/* eslint-disable */
import { XHeader } from "vux";
// eslint-disable-next-line
import "video.js/dist/video-js.css";
import { videoPlayer } from "vue-video-player";
import axios from "axios";
import jsonp from "jsonp";

const playerOptions = {
  height: 580,
  muted: false, // 静音
  language: "zh-CN",
  fluid: false,
};
// {`
//         // videojs options
//         height: 580,
//         width: window.app.width,
//         muted: true,
//         language: "en",
//         // playbackRates: [0.7, , 1.5, 2.0],
//         sources: [
//           {
//             type: "video/mp4",
//             src:
//               "https://api.amemv.com/aweme/v1/play/?video_id=v0200f490000bbq1mkcm7fi9ml8eh8cg&line=0&ratio=720p&media_type=4&vr_type=0&test_cdn=None&improve_bitrate=0"
//           }
//         ],
//         poster: "/static/images/author.jpg"
//       }`

export default {
  components: {
    XHeader,
    videoPlayer
  },
  data() {
    return {
      options: [],
      leftOptions: {
        backText: '切换',
        preventGoBack: true,
      },
      source: 1, // 1抖音 2快手
    };
  },
  mounted() {
    this.load();
  },
  methods: {
    load() {
      const url1 = this.source === 1 ?
        `https://cj.huitaodang.com/api/douyin/recommend/?t=${Date.now()}` :
        `https://cj.huitaodang.com/api/kuaishou/recommend/?t=${Date.now()}`;
      const url2 = `https://jsonp.afeld.me/?url=${url1}`;

      jsonp(url2, null, (err, data) => {
        if (err) {
          console.error(err.message);
        } else {
          console.log(data);
          function scrollTop(){
              var docScrollTop = document.documentElement.scrollTop || document.body.scrollTop;
              if(docScrollTop != 0){
                  document.body.scrollTop = document.documentElement.scrollTop = 0;
              }
          }

          if (data.aweme_list && data.aweme_list.length) {
            this.options = data.aweme_list.map((obj) => Object.assign({}, playerOptions, {
              width: window.app.width,
              sources: [{
                type: 'video/mp4',
                src: obj.video.play_addr.url_list[0]
              }],
              poster: obj.video_img,
              __desc: obj.desc,
              __nickname: obj.nickname,
              __share_url: obj.share_url || '',
            }));

            scrollTop();
          }
        }
      });
    },

    refresh() {
      this.options = [];
      this.load();
    },

    onPlayerCanplay(player) {

      // Remove controls from the player on iPad to stop native controls from stealing
      // our click
      var contentPlayer =  document.getElementById('content_video_html5_api');
      if ((navigator.userAgent.match(/iPad/i) ||
            navigator.userAgent.match(/Safari/i)||
            navigator.userAgent.match(/Android/i)) &&
            contentPlayer &&
          contentPlayer.hasAttribute('controls')) {
        contentPlayer.removeAttribute('controls');
      }

      // Initialize the ad container when the video player is clicked, but only the
      // first time it's clicked.
      // var startEvent = 'click';
      // if (navigator.userAgent.match(/iPhone/i) ||
      //     navigator.userAgent.match(/iPad/i) ||
      //     navigator.userAgent.match(/Android/i)) {
      //   startEvent = 'touchend';
      // }

      player.bigPlayButton.one('click', function () {
        player.enterFullScreen();
      });
    },

    onBackClick() {
      this.source = this.source === 1 ? 2 : 1;
      this.refresh();
    },
  }
};
</script>

<style>
.vjs-control-bar button {
  transform: scale(2) !important;
}
</style>


<style scoped>
.header {
  position: fixed;
  top: 0;
  width: 100%;
  z-index: 999;
}
.wrapper {
  margin-bottom: 50px;
  margin-top: 46px;
}
p {
  word-break: break-all;
  color: #ddd;
}
</style>
