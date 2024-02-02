from rest_framework.views import APIView
from rest_framework.response import Response

from .models import Rooms
from .forms import RoomCreationForm
from .serializers import RoomSerializer

from users.models import Users

class RoomManagementView(APIView):
    def post(self, request):
        '''
        Create a Room
        '''

        form = RoomCreationForm(request.data)

        if not form.is_valid():
            return Response({'message': 'Invalid request'}, status=400)
        
        form_data = form.cleaned_data

        if not (owner := Users.objects.get(id=form_data.get('owner'))):
            return Response({'message': 'Cannot create room, user does not exist'}, status=404)

        room = Rooms.objects.create(
            name=form_data.get('name'),
            owner=owner,
        )

        serialized_room = RoomSerializer(room).data

        return Response(serialized_room, status=200)
    
    def get(self, request, owner):
        '''
        Get all room objects
        '''

        rooms = Rooms.objects.filter(owner=owner)

        serialized_rooms = RoomSerializer(rooms, many=True).data

        return Response({'data': serialized_rooms}, status=200)
