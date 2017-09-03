---
layout: post
title:  "Puck Visibility"
date:   2017-09-03 13:10:00 +0200
categories: news technical
---

<p>What to do when the puck is hidden behind the rink?</p>

<p>One of the problems with a side-top-down view is that sometimes the puck is in a position where it is not visible from the camera. It can be when it's behind a group of players, behind a goal or just hidden by the rink itself</p>

<p>So to tackle this problem there are a few different ways to handle this:</p>

1. Show some kind of UI indicator of where the puck is
2. Change camera angle
3. Make puck render through objects

<p>I don't want to change the camera angle since that will affect the controls of the game and most likely confuse the human players. A UI indicator is very messy and covers up even more of the screen, so I decided to go with option 3.</p>

### Task: Make puck render through objects

This is a bit tricky and requires some shader work

My initial idea was just to change the geometry rendering layer and render the puck above everything else. However this turned out to be a really bad idea as the sense of depth was completely lost. Making it look like the puck was flying when on ground.

So instead I started writing a shader that produces a sillouette for the puck when something is in the way. I also added a bit of transparency to it so we don't get the "puck flying" feeling again.

<div class="row">
    <div class="six columns">
        <img src="{{ site.github.url }}/assets/images/posts/2017-09-03/puck_visible.png" alt="PUCK OFF" class="u-full-width">
        <i>Normal State - Puck is visible</i>
    </div>
    <div class="six columns">
        <img src="{{ site.github.url }}/assets/images/posts/2017-09-03/puck_hidden.png" alt="PUCK OFF" class="u-full-width">
        <i>Puck is hidden by rink, but visible as a transparent white sillouette</i>
    </div>
</div>
<hr />

### Result

The end result was pretty good, this is what it looks like in game:

<div class="row">
    <div class="six columns">
        <img src="{{ site.github.url }}/assets/images/posts/2017-09-03/puck_visible_gameplay.png" alt="PUCK OFF" class="u-full-width">
        <i>Gameplay</i>
    </div>
</div>

<hr />

### Shader

This is a two-pass surface shader
In the first pass we render the sillouette transparent without culling any faces and depthtest set to GEqual. This will make it render not just the surface but also the "shape" of the object. GEqual makes sure that we only render the sillouette if it is behind something else.
We also disable lighting when doing this.

In the second pass we just render the puck as normal, resetting culling, depthtest and lighting.

The neat thing about this is that we can change the sillouette color and transparency directly in Unity.

{% highlight glsl linenos %}
Shader "Custom/Standard-Color-Sillouette" {
    Properties {
        _Color ("Color", Color) = (1,1,1,1)
        _MainTex ("Albedo (RGB)", 2D) = "white" {}
        _SillouetteColor ("SillouetteColor", Color) = (1,1,1,0.2)
        _Glossiness ("Smoothness", Range(0,1)) = 0.5
        _Metallic ("Metallic", Range(0,1)) = 0.0
    }

    CGINCLUDE
        #include "UnityCG.cginc"

        sampler2D _MainTex;

        struct Input {
            float2 uv_MainTex;
        };

        half _Glossiness;
        half _Metallic;
        fixed4 _Color;
        fixed4 _SillouetteColor;

        void surf (Input IN, inout SurfaceOutputStandard o) {
            fixed4 c = tex2D (_MainTex, IN.uv_MainTex) * _Color;
            o.Albedo = c.rgb;
            o.Metallic = _Metallic;
            o.Smoothness = _Glossiness;
            o.Alpha = c.a;
        }

        void surf_sillouette (Input IN, inout SurfaceOutputStandard o) {
            o.Albedo = _SillouetteColor.rgb;
            o.Metallic = 0;
            o.Smoothness = 0;
            o.Alpha = _SillouetteColor.a;
        }

    ENDCG

    SubShader {
        Tags {  
            "Queue"="Transparent" 
            "RenderType"="Transparent" 
        }

        Cull Off
        ZWrite Off
        ZTest Always
        ZTest GEqual
        Blend DstColor SrcColor
        Lighting Off

        CGPROGRAM
        #pragma surface surf_sillouette Standard alpha
        #pragma target 3.0
        ENDCG

        Cull Back
        ZWrite On
        ZTest LEqual
        Blend SrcAlpha OneMinusSrcAlpha
        Lighting On

        CGPROGRAM
        #pragma surface surf Standard fullforwardshadows
        #pragma target 3.0
        ENDCG
    }
    
    FallBack "Diffuse"
}
{% endhighlight %}