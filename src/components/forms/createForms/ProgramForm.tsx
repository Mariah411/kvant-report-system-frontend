import {
  Checkbox,
  Form,
  FormInstance,
  Input,
  InputNumber,
  Radio,
  Row,
  Typography,
} from "antd";
import { CheckboxChangeEvent } from "antd/lib/checkbox";
import { useEffect, useState } from "react";
import DirectionService from "../../../api/DirectionsServise";
import { useTypedSelector } from "../../../hooks/useTypedSelectror";
import { IDirection } from "../../../models/IDirection";
import { IPlace } from "../../../models/IPlace";
import { rules } from "../../../utils/rules";
import SelectSearch from "../../UI/SelectSearch";

type Props = {
  form: FormInstance<any>;
};
const ProgramForm = (props: Props) => {
  const { form } = props;
  const [directions, setDirections] = useState<IDirection[]>([]);
  const [isDisabled, setIsDisabled] = useState(false);

  // получение мест пользователя
  const placesData: IPlace[] = useTypedSelector(
    (state) => state.auth.user.places
  );

  useEffect(() => {
    const getDirectionsData = async () => {
      const response = await DirectionService.getDirections();
      setDirections(response.data);
    };

    getDirectionsData();
  }, []);

  const оnChangeCheckBox = (e: CheckboxChangeEvent) => {
    if (e.target.checked) {
      const schoolId = form.getFieldValue("id_place");
      const schoolName = placesData.find(
        (place) => place.id === schoolId
      )?.name;
      form.setFieldsValue({ school: schoolName, type_school: "3" });
      setIsDisabled(true);
    } else {
      setIsDisabled(false);
      form.resetFields(["school", "type_school"]);
    }
  };

  return (
    <Form form={form} layout="vertical" name="form_in_modal">
      <Form.Item
        name="name"
        label="Название программы"
        rules={[rules.required()]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        name="id_nav"
        label="ID в АИС Навигатор"
        rules={[rules.required()]}
      >
        <InputNumber min={0} />
      </Form.Item>

      <Form.Item
        name="id_place"
        label="Выберите район (или учреждение дополнительного образования)"
        rules={[rules.required()]}
      >
        <SelectSearch form={form} data={placesData} fieldName="id_place" />
      </Form.Item>

      <Form.Item>
        <Checkbox onChange={оnChangeCheckBox}>
          Добавить программу для этого учреждения
        </Checkbox>
      </Form.Item>

      <Form.Item
        name="school"
        label="Наименование учреждения, в котором реализуется программа"
        rules={[rules.required()]}
      >
        <Input disabled={isDisabled} />
      </Form.Item>

      <Form.Item
        name="type_school"
        label="Тип учреждения"
        rules={[rules.required()]}
      >
        <Radio.Group disabled={isDisabled}>
          <Radio value="1">Дошкольное</Radio>
          <Radio value="2">Общеобразовательное</Radio>
          <Radio value="3">Дополнительного образования</Radio>
          <Radio value="4">СПО</Radio>
        </Radio.Group>
      </Form.Item>

      <Form.Item
        name="id_direction"
        label="Направление"
        rules={[rules.required()]}
      >
        <SelectSearch form={form} data={directions} fieldName="id_direction" />
      </Form.Item>

      <Typography.Paragraph>Возраст детей</Typography.Paragraph>
      <Row justify="start">
        <Form.Item name="start_age" rules={[rules.required()]}>
          <InputNumber placeholder="От" className="inputs-in-group" min={0} />
        </Form.Item>
        <Form.Item name="end_age" rules={[rules.required()]}>
          <InputNumber name="start_age" placeholder="До" min={0} />
        </Form.Item>
      </Row>

      <Form.Item
        name="programm_type"
        className="collection-create-form_last-form-item"
      >
        <Radio.Group>
          <Radio value="1">ДО(О)П</Radio>
          <Radio value="2">АДО(О)П</Radio>
        </Radio.Group>
      </Form.Item>
    </Form>
  );
};

export default ProgramForm;
