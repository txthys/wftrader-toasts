from os import getcwd
from winotify import Notification, audio

def sendToast(header, message):
    toast = Notification(app_id="Algo Trader",
                        title=header,
                        msg=message,
                        icon=getcwd() + r"\plat.png")

    toast.set_audio(audio.Default, loop=False)
    toast.show()