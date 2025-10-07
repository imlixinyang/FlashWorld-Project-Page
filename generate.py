
import os
import json
import base64
import random

templete = """
<div class="video-item" data-condition-image="{input_image}" data-condition-text="{input_text}">
    <video poster="" controls muted loop height="100%" preload="metadata">
        <source src="{output_video}" type="video/mp4">
    </video>
</div>
"""

list_html = []

# 递归遍历gallery文件夹下的所有文件
if __name__ == "__main__":
    for root, dirs, files in os.walk("./static/gallery"):
        for file in files:
            if file.endswith(".json"):
                with open(os.path.join(root, file), "r") as f:
                    data = json.load(f)
                    # 转base64
                    # input_image = base64.b64encode(open(os.path.join(root, file.replace(".json", ".png")), "rb").read()).decode("utf-8")
                    input_image = os.path.join(root, file.replace(".json", ".png"))
                    input_text = "" # data["text_prompt"]
                    output_video = os.path.join(root, file.replace(".json", ".mp4"))

                list_html.append(templete.format(input_image=input_image, input_text=input_text, output_video=output_video))

    random.shuffle(list_html)
    with open("gallery.html", "w") as f:
        f.write("\n".join(list_html))