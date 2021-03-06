class Api::V1::CardSerializer < ActiveModel::Serializer
	attributes :id, :back, :front, :picture
	has_many :lessons, serializer: Api::V1::LessonSerializer

  def picture
    picture_url = object.picture.present? ? object.picture_url : (object.source_url || object.picture_url)
    {url: picture_url}
  end
end
