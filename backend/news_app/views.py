from django.shortcuts import render
from django.http.response import JsonResponse
from django.http import JsonResponse
import json
from sodo_news.settings import connectDB, sendResponse, resultMessages, disconnectDB
from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth.hashers import make_password, check_password
from datetime import datetime, timezone

# Create your views here.


def getnewslist(request):
    jsons = json.loads(request.body)
    action = jsons['action']
    todo = {}
    try:

        with connectDB() as conn:
            query = f'''SELECT n.nid, news_title, n.content, huraangvi, image_url, category_name, author_name, published_at 
                        FROM t_amay_news as n
                        LEFT JOIN t_amay_news_category as c on c.category_id=n.category_id
                        LEFT JOIN t_amay_news_authors as a on a.aid = n.author_id
                        '''
            cur = conn.cursor()
            cur.execute(query)
            columns = cur.description
            rest = [{columns[index][0]: column
                     for index, column in enumerate(value)} for value in cur.fetchall()]

        resp = sendResponse(action, 200, "success", rest)

    except Exception as e:
        print(f"Алдаа гарлаа: {e}")
    finally:
        cur.close()

        disconnectDB(conn)

    return resp


def add_news(request):
    jsons = json.loads(request.body)
    action = jsons['action']
    try:

        title = jsons['news_title']
        content = jsons['content']
        huraangvi = jsons['huraangvi']
        img = jsons['image_url']
    except KeyError as e:
        print(f"Key алдаа: {e}")
        return sendResponse(action, 400, "key dutuu", [])
    try:
        with connectDB() as conn:
            cur = conn.cursor()


            query = '''INSERT INTO t_amay_news (news_title, content, huraangvi, image_url, published_at)
           VALUES (%s, %s, %s, %s, NOW()) RETURNING nid'''
            cur.execute(query, (title, content, huraangvi, img))
            result = cur.fetchone()[0]
            conn.commit()
            return sendResponse(action, 200, "Мэдээ амжилттай нэмэгдлээ", {"id": result})
    except Exception as e:
            print(f"DB алдаа: {e}")
            return sendResponse(action, 500, "dotood aldaa", [])


@csrf_exempt
def checkService(request):
    if request.method == "POST":
        try:
            jsons = json.loads(request.body)
        except:
            action = "invalid request json"
            respData = []
            resp = sendResponse(action, 404, "Error", respData)
            return (JsonResponse(resp))
        # print(jsons)
        try:
            action = jsons['action']
        except:
            action = "no action"
            respData = []
            resp = sendResponse(action, 400, "Error", respData)
            return (JsonResponse(resp))

        # print(action)
        if (action == 'getnewslist'):
            result = getnewslist(request)
            return (JsonResponse(result))
        elif(action == 'add_news'): 
            result = add_news(request)
            return (JsonResponse(result))

        else:
            action = action
            respData = []
            resp = sendResponse(action, 406, "Error", respData)
            return (JsonResponse(resp))
    elif request.method == "GET":
        return (JsonResponse({"method": "GET"}))
    else:
        return (JsonResponse({"method": "busad"}))


































































